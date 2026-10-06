import { useState, useEffect, useMemo } from "react";
import { Image, Video, Upload, X, Filter, Trash2, Edit2 } from "lucide-react";
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
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  const canUpload = isAdmin() || isModerator();

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all items once, we will filter locally for instant UI updates
      const data = await api.request(`/gallery`);
      setAllItems(data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch gallery:", err);
      setError(err.message || "Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []); // Only fetch once on mount

  // Local filtering for instant results without hitting the backend or re-downloading media
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (filterYear && item.year.toString() !== filterYear) return false;
      if (filterMonth && item.month.toString() !== filterMonth) return false;
      if (filterType && item.fileType !== filterType) return false;
      return true;
    });
  }, [allItems, filterYear, filterMonth, filterType]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterYear, filterMonth, filterType]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadType || !uploadYear || !uploadMonth) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!isEditing && !uploadFile) {
      alert("Please select a file to upload.");
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
      if (uploadFile) formData.append("file", uploadFile);

      const token = api.getAuthToken();
      
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = isEditing && editingId ? `${API_BASE_URL}/gallery/${editingId}` : `${API_BASE_URL}/gallery`;
        xhr.open(isEditing ? "PUT" : "POST", url, true);
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
              reject(new Error(res.message || "Failed to save item."));
            } catch (e) {
              reject(new Error("Failed to save item."));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network error occurred during upload."));
        xhr.send(formData);
      });

      closeModal();
      fetchGalleryItems();
    } catch (err: any) {
      console.error("Save error:", err);
      alert(err.message || "Failed to save gallery item.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const openModalForCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setUploadTitle("");
    setUploadDescription("");
    setUploadType("image");
    setUploadYear(new Date().getFullYear().toString());
    setUploadMonth((new Date().getMonth() + 1).toString());
    setUploadFile(null);
    setShowUploadModal(true);
  };

  const openModalForEdit = (item: GalleryItem) => {
    setIsEditing(true);
    setEditingId(item._id);
    setUploadTitle(item.title);
    setUploadDescription(item.description || "");
    setUploadType(item.fileType);
    setUploadYear(item.year.toString());
    setUploadMonth(item.month.toString());
    setUploadFile(null);
    setShowUploadModal(true);
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setIsEditing(false);
    setEditingId(null);
    setUploadFile(null);
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
            <Button onClick={openModalForCreate} className="bg-brand-blue gap-2">
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
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No items found matching your filters.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
              <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group relative">
                {canUpload && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => openModalForEdit(item)}
                      className="bg-white/90 hover:bg-white p-1.5 rounded-full text-brand-blue shadow-sm transition-colors"
                      title="Edit item"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="bg-white/90 hover:bg-white p-1.5 rounded-full text-red-500 shadow-sm transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {item.fileType === 'image' ? (
                    <img 
                      src={item.fileUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer" 
                      onClick={() => setSelectedMedia(item)}
                      loading="lazy"
                    />
                  ) : (
                    <video 
                      src={item.fileUrl} 
                      controls 
                      className="w-full h-full object-contain bg-black" 
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-white text-brand-navy border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-white text-brand-navy border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold text-brand-navy mb-6">
              {isEditing ? "Edit Gallery Item" : "Upload to Gallery"}
            </h2>
            
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEditing ? "Replace File (Optional)" : "File"}
                </label>
                <input 
                  type="file" 
                  accept={uploadType === "image" ? "image/*" : "video/*"}
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 border border-gray-300 rounded-lg px-3 py-2"
                  required={!isEditing}
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
                {uploading 
                  ? `${isEditing ? "Saving" : "Uploading"}... ${uploadProgress}%` 
                  : isEditing ? "Save Changes" : "Upload to Gallery"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMedia(null)}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedMedia(null); }}
            className="absolute right-6 top-6 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.fileType === 'image' ? (
              <img 
                src={selectedMedia.fileUrl} 
                alt={selectedMedia.title} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <video 
                src={selectedMedia.fileUrl} 
                controls 
                autoPlay
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl bg-black"
              />
            )}
            
            <div className="mt-6 text-center max-w-2xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-white">{selectedMedia.title}</h3>
              {selectedMedia.description && (
                <p className="text-gray-300 mt-2 text-sm">{selectedMedia.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
