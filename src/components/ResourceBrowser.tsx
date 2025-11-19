import { useState, useEffect } from 'react';
import { Music, Search, Heart, Download, ExternalLink, Play, Pause, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
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
  
  // Audio player state
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingResourceId, setPlayingResourceId] = useState<string | null>(null);

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
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-blue-600" />
            Resource Library
          </CardTitle>
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
    </div>
  );
}
