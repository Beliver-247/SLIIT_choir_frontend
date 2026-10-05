import { useState, useEffect } from "react";
import { Image, Video, Upload, X, Filter, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { api, API_BASE_URL } from "../utils/api";
import { isAdmin, isModerator } from "../utils/roleUtils";

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: "image" | "video";
  year: number;
  month: number;
}

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [uploadYear, setUploadYear] = useState(new Date().getFullYear().toString());
  const [uploadMonth, setUploadMonth] = useState((new Date().getMonth() + 1).toString());
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const canUpload = isAdmin() || isModerator();

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      let query = "?";
      if (filterYear) query += `year=${filterYear}&`;
      if (filterMonth) query += `month=${filterMonth}&`;
      if (filterType) query += `fileType=${filterType}&`;

      const data = await api.request(`/gallery${query}`);
      setItems(data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch gallery:", err);
      setError(err.message || "Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, [filterYear, filterMonth, filterType]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadType || !uploadYear || !uploadMonth || !uploadFile) {
      alert("Please fill in all required fields and select a file.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("title", uploadTitle);
      if (uploadDescription) formData.append("description", uploadDescription);
      formData.append("fileType", uploadType);
      formData.append("year", uploadYear);
      formData.append("month", uploadMonth);
      formData.append("file", uploadFile);

      const token = api.getAuthToken();
      
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/gallery`, true);
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            try {
              const res = JSON.parse(xhr.responseText);
              reject(new Error(res.message || "Failed to upload."));
            } catch (e) {
              reject(new Error("Failed to upload."));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network error occurred during upload."));
        xhr.send(formData);
      });

      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle("");
      setUploadDescription("");
      
      fetchGalleryItems();
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to upload to gallery.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.request(`/gallery/${id}`, { method: "DELETE" });
      fetchGalleryItems();
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err.message || "Failed to delete item.");
    }
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Gallery</h1>
            <p className="text-gray-600 mt-2">Memories and performances of the SLIIT Choir</p>
          </div>
          {canUpload && (
            <Button onClick={() => setShowUploadModal(true)} className="bg-brand-blue gap-2">
              <Upload className="h-4 w-4" />
              Upload Item
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-brand-navy font-semibold">
            <Filter className="h-4 w-4" />
            Filters:
          </div>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:border-brand-blue focus:ring-brand-blue"
          >
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:border-brand-blue focus:ring-brand-blue"
          >
            <option value="">All Months</option>
            {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>

          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:border-brand-blue focus:ring-brand-blue"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading gallery...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No items found matching your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group relative">
                {canUpload && (
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                
                <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {item.fileType === 'image' ? (
                    <img 
                      src={item.fileUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      loading="lazy"
                    />
                  ) : (
                    <video 
                      src={item.fileUrl} 
                      controls 
                      className="w-full h-full object-cover" 
                      preload="metadata"
                    />
                  )}
                  
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    {item.fileType === 'image' ? <Image className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                    {months[item.month - 1]} {item.year}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-brand-navy truncate">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold text-brand-navy mb-6">Upload to Gallery</h2>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-blue focus:ring-brand-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea 
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-blue focus:ring-brand-blue"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as "image" | "video")}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-blue focus:ring-brand-blue"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select 
                    value={uploadYear}
                    onChange={(e) => setUploadYear(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-blue focus:ring-brand-blue"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select 
                  value={uploadMonth}
                  onChange={(e) => setUploadMonth(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-blue focus:ring-brand-blue"
                >
                  {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input 
                  type="file" 
                  accept={uploadType === "image" ? "image/*" : "video/*"}
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              {uploading && (
                <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div 
                    className="bg-brand-blue h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <Button type="submit" disabled={uploading} className="w-full bg-brand-blue mt-4">
                {uploading ? `Uploading... ${uploadProgress}%` : "Upload to Gallery"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
