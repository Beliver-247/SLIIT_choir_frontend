import { useState, useEffect } from 'react';
import { Music, Plus, Edit, Trash2, CheckCircle, XCircle, Eye, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { api } from '../utils/api';

interface Resource {
  _id: string;
  songTitle: string;
  description: string;
  resourceType: string;
  fileUrl: string;
  fileType: string | null;
  fileSize: number | null;
  visibility: string;
  uploadedBy: {
    firstName: string;
    lastName: string;
  };
  status: string;
  createdAt: string;
}

interface ResourceRequest {
  _id: string;
  songTitle: string;
  description: string;
  resourceType: string;
  fileUrl: string;
  fileType: string | null;
  fileSize: number | null;
  visibility: string;
  requestedBy: {
    firstName: string;
    lastName: string;
    studentId: string;
  };
  status: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function ResourceManagement() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resources' | 'requests'>('resources');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    songTitle: '',
    description: '',
    resourceType: 'sheet_music',
    visibility: 'all_members',
    fileUrl: '',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchResources();
    fetchRequests();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.resources.getAll();
      if (response.success && response.data) {
        setResources(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await api.resourceRequests.getAll();
      if (response.success && response.data) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type based on resource type
      if (formData.resourceType === 'sheet_music') {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(selectedFile.type)) {
          alert('Sheet music must be PDF or image (JPEG, PNG)');
          return;
        }
      } else if (formData.resourceType.startsWith('audio_')) {
        const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav'];
        if (!allowedTypes.includes(selectedFile.type)) {
          alert('Audio files must be MP3 or WAV');
          return;
        }
      }
      
      // Check file size (20MB limit)
      if (selectedFile.size > 20 * 1024 * 1024) {
        alert('File size must be less than 20MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.songTitle || !formData.description || !formData.resourceType) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate based on resource type
    if (['google_drive_link', 'youtube_link'].includes(formData.resourceType)) {
      if (!formData.fileUrl) {
        alert('Please provide a URL');
        return;
      }
    } else {
      if (!file) {
        alert('Please select a file to upload');
        return;
      }
    }

    try {
      setActionLoading(true);
      const submitFormData = new FormData();
      submitFormData.append('songTitle', formData.songTitle);
      submitFormData.append('description', formData.description);
      submitFormData.append('resourceType', formData.resourceType);
      submitFormData.append('visibility', formData.visibility);
      
      if (formData.fileUrl) {
        submitFormData.append('fileUrl', formData.fileUrl);
      }
      
      if (file) {
        submitFormData.append('file', file);
      }

      const response = await api.resources.create(submitFormData);
      
      if (response.success) {
        alert('Resource created successfully!');
        setShowAddModal(false);
        resetForm();
        fetchResources();
      } else {
        alert('Failed to create resource: ' + response.error);
      }
    } catch (error) {
      alert('Failed to create resource');
      console.error('Create resource error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedResource) return;

    try {
      setActionLoading(true);
      const response = await api.resources.update(selectedResource._id, {
        songTitle: formData.songTitle,
        description: formData.description,
        visibility: formData.visibility,
        fileUrl: formData.fileUrl,
      });

      if (response.success) {
        alert('Resource updated successfully!');
        setShowEditModal(false);
        setSelectedResource(null);
        resetForm();
        fetchResources();
      } else {
        alert('Failed to update resource: ' + response.error);
      }
    } catch (error) {
      alert('Failed to update resource');
      console.error('Update resource error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await api.resources.delete(id);
      if (response.success) {
        alert('Resource deleted successfully!');
        fetchResources();
      } else {
        alert('Failed to delete resource: ' + response.error);
      }
    } catch (error) {
      alert('Failed to delete resource');
      console.error('Delete resource error:', error);
    }
  };

  const handleApproveRequest = async (id: string) => {
    if (!confirm('Approve this resource request?')) return;

    try {
      setActionLoading(true);
      const response = await api.resourceRequests.approve(id);
      if (response.success) {
        alert('Request approved!');
        fetchRequests();
        fetchResources();
        setSelectedRequest(null);
      } else {
        alert('Failed to approve request: ' + response.error);
      }
    } catch (error) {
      alert('Failed to approve request');
      console.error('Approve request error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (id: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      const response = await api.resourceRequests.reject(id, rejectionReason);
      if (response.success) {
        alert('Request rejected');
        fetchRequests();
        setSelectedRequest(null);
        setRejectionReason('');
      } else {
        alert('Failed to reject request: ' + response.error);
      }
    } catch (error) {
      alert('Failed to reject request');
      console.error('Reject request error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData({
      songTitle: resource.songTitle,
      description: resource.description,
      resourceType: resource.resourceType,
      visibility: resource.visibility,
      fileUrl: resource.fileUrl,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      songTitle: '',
      description: '',
      resourceType: 'sheet_music',
      visibility: 'all_members',
      fileUrl: '',
    });
    setFile(null);
  };

  const getResourceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sheet_music: 'Sheet Music',
      audio_soprano: 'Audio - Soprano',
      audio_alto: 'Audio - Alto',
      audio_tenor: 'Audio - Tenor',
      audio_bass: 'Audio - Bass',
      google_drive_link: 'Google Drive Link',
      youtube_link: 'YouTube Link',
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-blue-600" />
              Resource Management
            </CardTitle>
            {activeTab === 'resources' && (
              <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'resources'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resources ({resources.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Requests ({requests.filter(r => r.status === 'pending').length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Resources List */}
      {activeTab === 'resources' && (
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading resources...</div>
            ) : resources.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No resources found</div>
            ) : (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource._id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-blue-900">{resource.songTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            {getResourceTypeLabel(resource.resourceType)}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-800">
                            {resource.visibility === 'all_members' ? 'All Members' : 'Admin/Moderator Only'}
                          </Badge>
                          {resource.fileSize && (
                            <Badge className="bg-green-100 text-green-800">
                              {formatFileSize(resource.fileSize)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Uploaded by {resource.uploadedBy.firstName} {resource.uploadedBy.lastName} •{' '}
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(resource.fileUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(resource)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(resource._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      {activeTab === 'requests' && (
        <Card>
          <CardContent className="p-6">
            {requests.filter(r => r.status === 'pending').length === 0 ? (
              <div className="text-center py-8 text-gray-600">No pending requests</div>
            ) : (
              <div className="space-y-4">
                {requests
                  .filter(r => r.status === 'pending')
                  .map((request) => (
                    <div key={request._id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-blue-900">{request.songTitle}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {getResourceTypeLabel(request.resourceType)}
                            </Badge>
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Requested by {request.requestedBy.firstName} {request.requestedBy.lastName} ({request.requestedBy.studentId}) •{' '}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">Add New Resource</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="songTitle">Song Title *</Label>
                  <Input
                    id="songTitle"
                    value={formData.songTitle}
                    onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="resourceType">Resource Type *</Label>
                  <Select value={formData.resourceType} onValueChange={(value) => setFormData({ ...formData, resourceType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sheet_music">Sheet Music</SelectItem>
                      <SelectItem value="audio_soprano">Audio - Soprano</SelectItem>
                      <SelectItem value="audio_alto">Audio - Alto</SelectItem>
                      <SelectItem value="audio_tenor">Audio - Tenor</SelectItem>
                      <SelectItem value="audio_bass">Audio - Bass</SelectItem>
                      <SelectItem value="google_drive_link">Google Drive Link</SelectItem>
                      <SelectItem value="youtube_link">YouTube Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="visibility">Visibility *</Label>
                  <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_members">All Members</SelectItem>
                      <SelectItem value="admin_moderator_only">Admin/Moderator Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {['google_drive_link', 'youtube_link'].includes(formData.resourceType) ? (
                  <div>
                    <Label htmlFor="fileUrl">URL *</Label>
                    <Input
                      id="fileUrl"
                      type="url"
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      placeholder="https://..."
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="file">
                      {formData.resourceType === 'sheet_music' ? 'Upload Sheet Music (PDF/Image) *' : 'Upload Audio File (MP3/WAV) *'}
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept={formData.resourceType === 'sheet_music' ? '.pdf,image/*' : 'audio/*'}
                      required
                    />
                    {file && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {file.name} ({formatFileSize(file.size)})
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={actionLoading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {actionLoading ? 'Creating...' : 'Create Resource'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditModal && selectedResource && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">Edit Resource</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <Label htmlFor="edit-songTitle">Song Title *</Label>
                <Input
                  id="edit-songTitle"
                  value={formData.songTitle}
                  onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-visibility">Visibility *</Label>
                <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_members">All Members</SelectItem>
                    <SelectItem value="admin_moderator_only">Admin/Moderator Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {['google_drive_link', 'youtube_link'].includes(selectedResource.resourceType) && (
                <div>
                  <Label htmlFor="edit-fileUrl">URL</Label>
                  <Input
                    id="edit-fileUrl"
                    type="url"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdate} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={actionLoading}>
                  {actionLoading ? 'Updating...' : 'Update Resource'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedResource(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Review Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">Review Resource Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div>
                <h3 className="font-semibold mb-1">Song Title</h3>
                <p>{selectedRequest.songTitle}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p>{selectedRequest.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Resource Type</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  {getResourceTypeLabel(selectedRequest.resourceType)}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Visibility</h3>
                <p>{selectedRequest.visibility === 'all_members' ? 'All Members' : 'Admin/Moderator Only'}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">File/Link</h3>
                <a href={selectedRequest.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                  {selectedRequest.fileUrl}
                </a>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Requested By</h3>
                <p>
                  {selectedRequest.requestedBy.firstName} {selectedRequest.requestedBy.lastName} ({selectedRequest.requestedBy.studentId})
                </p>
              </div>

              <div>
                <Label htmlFor="rejection-reason">Rejection Reason (if declining)</Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason if rejecting..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleApproveRequest(selectedRequest._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={actionLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleRejectRequest(selectedRequest._id)}
                  variant="destructive"
                  className="flex-1"
                  disabled={actionLoading || !rejectionReason.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(null);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
