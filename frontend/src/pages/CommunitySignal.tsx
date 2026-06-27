import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';
import { UploadCloud, MapPin, ArrowRight, ArrowLeft, CheckCircle2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { toast } from 'sonner';
import { Loading } from '../components/ui/Loading';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, setLocationText }: { position: any, setPosition: any, setLocationText: any }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lon: lng });
      reverseGeocode(lat, lng).then(setLocationText);
    },
  });

  return position === null ? null : (
    <Marker 
      position={[position.lat, position.lon]} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition({ lat: pos.lat, lon: pos.lng });
          reverseGeocode(pos.lat, pos.lng).then(setLocationText);
        }
      }}
    />
  );
}

async function reverseGeocode(lat: number, lon: number) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

export function CommunitySignal() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);
  
  const [evidenceAssessment, setEvidenceAssessment] = useState<any | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  
  const [isLocating, setIsLocating] = useState(false);
  const [mapCoords, setMapCoords] = useState<{lat: number, lon: number} | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const totalSteps = 4;


  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude, accuracy: locAccuracy } = position.coords;
      setMapCoords({ lat: latitude, lon: longitude });
      setAccuracy(locAccuracy);
      await reverseGeocode(latitude, longitude);
      toast.success("Location detected successfully");
      setIsLocating(false);
    }, (_err) => {
      toast.error("Location permission denied. Please enter manually.");
      setIsLocating(false);
    });
  };

  const processFile = async (file: File) => {
    if (imageFile && file.name === imageFile.name && file.size === imageFile.size) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB.");
      return;
    }

    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setEvidenceAssessment(null);
    setIsAssessing(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/signals/assess`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const assessment = await response.json();
        setEvidenceAssessment(assessment);
      } else {
        throw new Error("Assessment failed");
      }
    } catch (err) {
      console.error("Assessment failed:", err);
      // Fallback object to avoid hard failure, but UI indicates waiting if null
    } finally {
      setIsAssessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isAssessing) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!imageFile || !title || !description || !location) {
      toast.error("Please complete all steps before submitting.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); 
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/signals`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 413) throw new Error("Image file is too large. Max size is 10MB.");
        if (response.status === 415) throw new Error("Unsupported file format. Use JPG, PNG, or WEBP.");
        if (response.status === 500) throw new Error("Backend is unavailable or failed to process the request.");
        throw new Error("Invalid response from server.");
      }

      const report = await response.json();
      toast.success("Report submitted successfully");
      navigate(`/success`, { 
        state: { 
          report, 
          imagePreview: image,
          submittedLocation: location 
        } 
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast.error("Request timed out. The server took too long to respond.");
      } else if (err.message.includes('fetch')) {
        toast.error("Network failure. Could not connect to the server.");
      } else {
        toast.error(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setStep(s => Math.min(s + 1, totalSteps));
  };
  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl min-h-[80vh] flex flex-col justify-center">
      
      {/* Header & Progress */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-8 text-center">Submit Community Signal</h1>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -z-10 -translate-y-1/2" />
          <div 
            className="absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
          
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-500 ${
                step >= i ? 'bg-primary text-primary-foreground' : 'bg-background border-2 border-border text-muted-foreground'
              }`}
            >
              {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background border border-border shadow-subtle rounded-2xl p-8 relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">📷 Photographic Evidence</h2>
                <p className="text-sm text-muted-foreground">Upload a clear photo of the issue for AI visual analysis.</p>
              </div>
              
              {!image ? (
                <div 
                  className={`w-full border-2 border-dashed rounded-xl p-8 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/10'} focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={handleDrop}
                  tabIndex={0}
                  onKeyDown={(e) => { if(e.key === 'Enter') fileInputRef.current?.click() }}
                  aria-label="Upload Dropzone"
                >
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 bg-muted flex items-center justify-center rounded-full text-muted-foreground">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Drag & Drop supported</p>
                      <p className="text-sm text-muted-foreground mt-1">PNG • JPG • WEBP<br/>Maximum 10 MB</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Choose Image
                      </Button>
                      <span className="text-sm text-muted-foreground">or</span>
                      <Button type="button" onClick={() => {
                        if (!isMobile) {
                          toast.error("Camera unavailable on this device. Please use 'Choose Image' instead.");
                        } else {
                          cameraInputRef.current?.click();
                        }
                      }} className="flex items-center gap-2">
                        <Camera className="w-4 h-4" /> {isMobile ? "Capture Photo" : "Use Camera (Mobile)"}
                      </Button>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                    <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-success mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Image Uploaded Successfully</span>
                  </div>
                  
                  <div className="relative w-full h-56 rounded-xl overflow-hidden border border-border">
                    <img src={image} loading="lazy" alt="Evidence Preview" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()} disabled={isAssessing}>
                      Replace Image
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 text-error hover:text-error hover:bg-error/10" onClick={() => { setImage(null); setImageFile(null); setEvidenceAssessment(null); }} aria-label="Remove Image" disabled={isAssessing}>
                      Remove Image
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                  </div>
                  
                  {isAssessing && (
                    <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm rounded-xl">
                      <Loading messages={["Uploading evidence...", "Analyzing image...", "Generating Trust Score..."]} />
                    </div>
                  )}
                  
                  {evidenceAssessment && !isAssessing && (
                    <div className="p-4 bg-muted/10 rounded-xl border border-border space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Evidence Quality Assessment</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">{evidenceAssessment.qualityScore}%</span>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${evidenceAssessment.qualityScore >= 90 ? 'bg-success/10 text-success' : evidenceAssessment.qualityScore >= 75 ? 'bg-primary/10 text-primary' : evidenceAssessment.qualityScore >= 60 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}`}>
                            {evidenceAssessment.qualityScore >= 90 ? 'Excellent' : evidenceAssessment.qualityScore >= 75 ? 'Good' : evidenceAssessment.qualityScore >= 60 ? 'Fair' : 'Poor'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {[
                          { label: 'Image Quality', value: evidenceAssessment.imageQuality },
                          { label: 'Lighting', value: evidenceAssessment.lighting },
                          { label: 'Subject Visibility', value: evidenceAssessment.subjectVisibility },
                          { label: 'Context Richness', value: evidenceAssessment.contextRichness }
                        ].map((metric, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{metric.label}</span>
                            <div className="flex items-center gap-2">
                               <span className="font-medium">{metric.value}%</span>
                               <span className={`text-[10px] uppercase ${metric.value >= 90 ? 'text-success' : metric.value >= 75 ? 'text-primary' : metric.value >= 60 ? 'text-warning' : 'text-error'}`}>
                                 {metric.value >= 90 ? 'Excellent' : metric.value >= 75 ? 'Good' : metric.value >= 60 ? 'Fair' : 'Poor'}
                               </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">Location Data</h2>
                <p className="text-sm text-muted-foreground">Where did you observe this issue?</p>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    className="pl-10 h-12 focus-visible:ring-primary" 
                    placeholder="e.g. 1200 Main St, Downtown" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button type="button" variant="secondary" className="shrink-0 h-12" onClick={handleDetectLocation} disabled={isLocating}>
                  {isLocating ? 'Locating...' : 'Detect Location'}
                </Button>
              </div>

              {mapCoords && accuracy && (
                <div className="bg-success/10 border border-success/30 p-3 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-success">GPS Detected</p>
                    <p className="text-muted-foreground mt-1">Lat: {mapCoords.lat.toFixed(4)}, Lon: {mapCoords.lon.toFixed(4)}</p>
                    <p className="text-muted-foreground">Accuracy: ~{Math.round(accuracy)} meters</p>
                  </div>
                </div>
              )}
              
              <div className="h-64 w-full bg-muted/20 rounded-xl border border-border flex items-center justify-center overflow-hidden relative">
                {mapCoords ? (
                  <MapContainer center={[mapCoords.lat, mapCoords.lon]} zoom={16} scrollWheelZoom={true} className="w-full h-full z-10">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={mapCoords} setPosition={setMapCoords} setLocationText={setLocation} />
                  </MapContainer>
                ) : (
                  <p className="text-sm text-muted-foreground">Map will appear when location is detected.</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">Context & Details</h2>
                <p className="text-sm text-muted-foreground">Provide additional context to cross-reference with the visual evidence.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Title</Label>
                  <Input 
                    placeholder="Brief summary (e.g., Deep pothole on Main St)" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="focus-visible:ring-primary"
                    autoFocus
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Detailed Description</Label>
                  <Textarea 
                    placeholder="Describe any hazards, how long it has been there, etc..."
                    className="min-h-[140px] focus-visible:ring-primary"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Ready for Investigation</h2>
                <p className="text-sm text-muted-foreground">Review your signal before submitting to the AI Decision Engine.</p>
              </div>
              
              <div className="bg-muted/10 p-4 rounded-xl border border-border space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Evidence</span>
                  <span className="font-medium">{image ? 'Uploaded' : 'Missing'}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{location || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Context</span>
                  <span className="font-medium">{title ? 'Provided' : 'Missing'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      {isSubmitting && (
        <Loading 
          fullScreen 
          messages={["Running AI investigation...", "Checking duplicate reports...", "Calculating Trust Score...", "Preparing recommendations..."]} 
        />
      )}
      <div className="mt-8 flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
          className="w-32 focus-visible:ring-primary"
          aria-label="Previous Step"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        
        {step < totalSteps ? (
          <Button 
            onClick={nextStep}
            disabled={step === 1 && (!image || isAssessing)}
            className="w-32 focus-visible:ring-primary"
            aria-label="Next Step"
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="w-48 focus-visible:ring-primary"
            aria-label="Submit Investigation"
          >
            {isSubmitting ? 'Analyzing...' : 'Start AI Investigation'}
          </Button>
        )}
      </div>

    </div>
  );
}
