import { useState, useEffect } from 'react';
import { Music, Search, Heart, Download, ExternalLink, Play, Pause, Volume2, Upload, Clock } from 'lucide-react';
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
  createdAt: string;
}

interface ResourcesBySong {
  [songTitle: string]: Resource[];
}

export default function ResourceBrowser() {
  const [resourcesBySong, setResourcesBySong] = useState<ResourcesBySong>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [expandedSongs, setExpandedSongs] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Audio player state
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingResourceId, setPlayingResourceId] = useState<string | null>(null);

  // Upload form state
  const [uploadFormData, setUploadFormData] = useState({
    songTitle: '',
    description: '',
    resourceType: 'sheet_music',
    visibility: 'all_members',
    fileUrl: '',
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetchResources();
    fetchFavorites();
    
    // Cleanup audio on unmount
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.resources.getBySong();
      if (response.success && response.data) {
        setResourcesBySong(response.data);
        // Auto-expand all songs initially
        setExpandedSongs(new Set(Object.keys(response.data)));
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.favorites.getAll();
      if (response.success && response.data) {
        const favoriteIds = new Set<string>(response.data.map((fav: any) => fav.resourceId._id as string));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const toggleFavorite = async (resourceId: string) => {
    try {
      const isFavorite = favorites.has(resourceId);
      
      if (isFavorite) {
        const response = await api.favorites.remove(resourceId);
        if (response.success) {
          setFavorites((prev) => {
            const newFavorites = new Set(prev);
            newFavorites.delete(resourceId);
            return newFavorites;
          });
        }
      } else {
        const response = await api.favorites.add(resourceId);
        if (response.success) {
          setFavorites((prev) => new Set(prev).add(resourceId));
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const toggleSongExpansion = (songTitle: string) => {
    setExpandedSongs((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(songTitle)) {
        newExpanded.delete(songTitle);
      } else {
        newExpanded.add(songTitle);
      }
      return newExpanded;
    });
  };

  const fetchMyRequests = async () => {
    try {
      const response = await api.resourceRequests.getMyRequests();
      if (response.success && response.data) {
        setMyRequests(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch my requests:', error);
    }
  };

  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type based on resource type
      if (uploadFormData.resourceType === 'sheet_music') {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(selectedFile.type)) {
          alert('Sheet music must be PDF or image (JPEG, PNG)');
          return;
        }
      } else if (uploadFormData.resourceType.startsWith('audio_')) {
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
      
      setUploadFile(selectedFile);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFormData.songTitle || !uploadFormData.description || !uploadFormData.resourceType) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate based on resource type
    if (['google_drive_link', 'youtube_link'].includes(uploadFormData.resourceType)) {
      if (!uploadFormData.fileUrl) {
        alert('Please provide a URL');
        return;
      }
    } else {
      if (!uploadFile) {
        alert('Please select a file to upload');
        return;
      }
    }

    try {
      setActionLoading(true);
      const submitFormData = new FormData();
      submitFormData.append('songTitle', uploadFormData.songTitle);
      submitFormData.append('description', uploadFormData.description);
      submitFormData.append('resourceType', uploadFormData.resourceType);
      submitFormData.append('visibility', uploadFormData.visibility);
      
      if (uploadFormData.fileUrl) {
        submitFormData.append('fileUrl', uploadFormData.fileUrl);
      }
      
      if (uploadFile) {
        submitFormData.append('file', uploadFile);
      }

      const response = await api.resourceRequests.create(submitFormData);
      
      if (response.success) {
        alert('Resource submitted for approval! Moderators will review it soon.');
        setShowUploadModal(false);
        resetUploadForm();
        fetchMyRequests();
      } else {
        alert('Failed to submit resource: ' + response.error);
      }
    } catch (error) {
      alert('Failed to submit resource');
      console.error('Submit resource error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFormData({
      songTitle: '',
      description: '',
      resourceType: 'sheet_music',
      visibility: 'all_members',
      fileUrl: '',
    });
    setUploadFile(null);
  };

  const playAudio = (resource: Resource) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }

    // If clicking the same resource, just stop
    if (playingResourceId === resource._id) {
      setCurrentAudio(null);
      setPlayingResourceId(null);
      return;
    }

    // Create and play new audio
    const audio = new Audio(resource.fileUrl);
    audio.addEventListener('ended', () => {
      setPlayingResourceId(null);
    });
    
    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
      alert('Failed to play audio. Please try again.');
    });

    setCurrentAudio(audio);
    setPlayingResourceId(resource._id);
  };

  const getResourceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sheet_music: 'Sheet Music',
      audio_soprano: 'Soprano',
      audio_alto: 'Alto',
      audio_tenor: 'Tenor',
      audio_bass: 'Bass',
      google_drive_link: 'Google Drive',
      youtube_link: 'YouTube',
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  // Filter resources based on search and type filter
  const filteredResourcesBySong = Object.entries(resourcesBySong).reduce((acc, [songTitle, resources]) => {
    // Filter by search query
    if (searchQuery && !songTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return acc;
    }

    // Filter by resource type
    const filteredResources = resourceTypeFilter === 'all' 
      ? resources 
      : resources.filter(r => r.resourceType === resourceTypeFilter);

    if (filteredResources.length > 0) {
      acc[songTitle] = filteredResources;
    }

    return acc;
  }, {} as ResourcesBySong);

  const renderResourceCard = (resource: Resource) => {
    const isAudio = resource.resourceType.startsWith('audio_');
    const isSheetMusic = resource.resourceType === 'sheet_music';
    const isExternalLink = ['google_drive_link', 'youtube_link'].includes(resource.resourceType);
    const isPlaying = playingResourceId === resource._id;
    const isFavorite = favorites.has(resource._id);

    return (
      <div key={resource._id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                {getResourceTypeLabel(resource.resourceType)}
              </Badge>
              {resource.fileSize && (
                <span className="text-xs text-gray-500">{formatFileSize(resource.fileSize)}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">{resource.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              Uploaded by {resource.uploadedBy.firstName} {resource.uploadedBy.lastName}
            </p>
          </div>
          
          <div className="flex gap-2 ml-4">
            {/* Favorite Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleFavorite(resource._id)}
              className={isFavorite ? 'text-red-600 border-red-600' : ''}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-600' : ''}`} />
            </Button>

            {/* Play/Pause for Audio */}
            {isAudio && (
              <Button
                size="sm"
                onClick={() => playAudio(resource)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </>
                )}
              </Button>
            )}

            {/* Download for Sheet Music */}
            {isSheetMusic && (
              <Button
                size="sm"
                onClick={() => window.open(resource.fileUrl, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}

            {/* External Link */}
            {isExternalLink && (
              <Button
                size="sm"
                onClick={() => window.open(resource.fileUrl, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-blue-600" />
              Resource Library
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  fetchMyRequests();
                  setShowMyRequestsModal(true);
                }}
              >
                <Clock className="h-4 w-4 mr-2" />
                My Requests
              </Button>
              <Button onClick={() => setShowUploadModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search songs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={resourceTypeFilter} onValueChange={setResourceTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sheet_music">Sheet Music</SelectItem>
                  <SelectItem value="audio_soprano">Soprano</SelectItem>
                  <SelectItem value="audio_alto">Alto</SelectItem>
                  <SelectItem value="audio_tenor">Tenor</SelectItem>
                  <SelectItem value="audio_bass">Bass</SelectItem>
                  <SelectItem value="google_drive_link">Google Drive</SelectItem>
                  <SelectItem value="youtube_link">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audio Player Status */}
          {playingResourceId && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Volume2 className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm text-blue-900 font-medium">Audio playing...</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.src = '';
                  }
                  setCurrentAudio(null);
                  setPlayingResourceId(null);
                }}
                className="ml-auto"
              >
                Stop
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resources by Song */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-600">Loading resources...</div>
          </CardContent>
        </Card>
      ) : Object.keys(filteredResourcesBySong).length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-600">
              {searchQuery || resourceTypeFilter !== 'all' ? 'No resources match your filters' : 'No resources available'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(filteredResourcesBySong)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([songTitle, resources]) => (
              <Card key={songTitle}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSongExpansion(songTitle)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-900">{songTitle}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-100 text-gray-800">
                        {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        {expandedSongs.has(songTitle) ? '▼' : '▶'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {expandedSongs.has(songTitle) && (
                  <CardContent className="space-y-3">
                    {resources
                      .sort((a, b) => {
                        // Sort order: sheet_music first, then audio parts in order, then links
                        const order = ['sheet_music', 'audio_soprano', 'audio_alto', 'audio_tenor', 'audio_bass', 'google_drive_link', 'youtube_link'];
                        return order.indexOf(a.resourceType) - order.indexOf(b.resourceType);
                      })
                      .map((resource) => renderResourceCard(resource))}
                  </CardContent>
                )}
              </Card>
            ))}
        </div>
      )}

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">Upload Resource for Approval</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <p className="text-sm text-blue-900">
                  Your resource will be reviewed by moderators before being published to the library.
                </p>
              </div>
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="songTitle">Song Title *</Label>
                  <Input
                    id="songTitle"
                    value={uploadFormData.songTitle}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, songTitle: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={uploadFormData.description}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                    rows={3}
                    required
                    placeholder="Describe this resource..."
                  />
                </div>

                <div>
                  <Label htmlFor="resourceType">Resource Type *</Label>
                  <Select value={uploadFormData.resourceType} onValueChange={(value) => setUploadFormData({ ...uploadFormData, resourceType: value })}>
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
                  <Select value={uploadFormData.visibility} onValueChange={(value) => setUploadFormData({ ...uploadFormData, visibility: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_members">All Members</SelectItem>
                      <SelectItem value="admin_moderator_only">Admin/Moderator Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {['google_drive_link', 'youtube_link'].includes(uploadFormData.resourceType) ? (
                  <div>
                    <Label htmlFor="fileUrl">URL *</Label>
                    <Input
                      id="fileUrl"
                      type="url"
                      value={uploadFormData.fileUrl}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, fileUrl: e.target.value })}
                      placeholder="https://..."
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="file">
                      {uploadFormData.resourceType === 'sheet_music' ? 'Upload Sheet Music (PDF/Image) *' : 'Upload Audio File (MP3/WAV) *'}
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleUploadFileChange}
                      accept={uploadFormData.resourceType === 'sheet_music' ? '.pdf,image/*' : 'audio/*'}
                      required
                    />
                    {uploadFile && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={actionLoading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {actionLoading ? 'Submitting...' : 'Submit for Approval'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowUploadModal(false);
                      resetUploadForm();
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

      {/* My Requests Modal */}
      {showMyRequestsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">My Resource Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white">
              {myRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  You haven't submitted any resources yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((request) => (
                    <div key={request._id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900">{request.songTitle}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {getResourceTypeLabel(request.resourceType)}
                            </Badge>
                            <Badge className={
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Submitted {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          {request.status === 'rejected' && request.rejectionReason && (
                            <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                              <p className="text-sm text-red-900">
                                <strong>Rejection reason:</strong> {request.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end pt-4">
                <Button onClick={() => setShowMyRequestsModal(false)} variant="outline">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
