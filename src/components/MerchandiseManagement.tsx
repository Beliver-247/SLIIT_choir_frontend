import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { api } from '../utils/api';

interface Merchandise {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  sizes: string[];
  stock: number;
  category: 'tshirt' | 'band' | 'hoodie';
  status: 'available' | 'unavailable' | 'discontinued';
}

interface MerchandiseFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  sizes: string[];
  stock: string;
  category: 'tshirt' | 'band' | 'hoodie' | '';
  status: 'available' | 'unavailable' | 'discontinued';
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

export default function MerchandiseManagement({ onBack }: { onBack?: () => void }) {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MerchandiseFormData>({
    name: '',
    description: '',
    price: '',
    image: '',
    sizes: [],
    stock: '0',
    category: '',
    status: 'available',
  });

  useEffect(() => {
    fetchMerchandise();
  }, []);

  const fetchMerchandise = async () => {
    try {
      setLoading(true);
      const response = await api.merchandise.getAll();
      
      if (response.success && response.data) {
        setMerchandise(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch merchandise:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      sizes: [],
      stock: '0',
      category: '',
      status: 'available',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: Merchandise) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image || '',
      sizes: item.sizes,
      stock: item.stock.toString(),
      category: item.category,
      status: item.status,
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleSizeToggle = (size: string) => {
    if (formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.sizes.length === 0) {
      alert('Please select at least one size');
      return;
    }

    const data = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image || null,
      sizes: formData.sizes,
      stock: parseInt(formData.stock) || 0,
      category: formData.category,
      status: formData.status,
    };

    try {
      let response;
      if (editingId) {
        response = await api.merchandise.update(editingId, data);
      } else {
        response = await api.merchandise.create(data);
      }

      if (response.success) {
        alert(editingId ? 'Merchandise updated successfully!' : 'Merchandise created successfully!');
        resetForm();
        fetchMerchandise();
      } else {
        alert('Failed to save merchandise: ' + response.error);
      }
    } catch (error) {
      alert('Failed to save merchandise');
      console.error('Save merchandise error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this merchandise item?')) return;

    try {
      const response = await api.merchandise.delete(id);
      
      if (response.success) {
        alert('Merchandise deleted successfully!');
        fetchMerchandise();
      } else {
        alert('Failed to delete merchandise: ' + response.error);
      }
    } catch (error) {
      alert('Failed to delete merchandise');
      console.error('Delete merchandise error:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tshirt': return 'T-Shirt';
      case 'band': return 'Band';
      case 'hoodie': return 'Hoodie';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-900">Merchandise Management</h1>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <X className="h-4 w-4 mr-2" />
              Back to Catalog
            </Button>
          )}
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Merchandise
          </Button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="border-2 border-blue-600">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Merchandise' : 'Add New Merchandise'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tshirt">T-Shirt</SelectItem>
                      <SelectItem value="band">Band</SelectItem>
                      <SelectItem value="hoodie">Hoodie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (LKR) <span className="text-red-500">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description <span className="text-red-500">*</span></Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Sizes <span className="text-red-500">*</span></Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded border transition-colors ${
                        formData.sizes.includes(size)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Create'} Merchandise
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Merchandise List */}
      <Card>
        <CardHeader>
          <CardTitle>All Merchandise ({merchandise.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading...</div>
          ) : merchandise.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No merchandise items found</div>
          ) : (
            <div className="space-y-4">
              {merchandise.map((item) => (
                <div key={item._id} className="border rounded-lg p-4 flex items-start gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?w=200'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?w=200';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-blue-900">{item.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{getCategoryLabel(item.category)}</Badge>
                          <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-blue-900">
                        LKR {item.price.toLocaleString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span><strong>Sizes:</strong> {item.sizes.join(', ')}</span>
                      <span><strong>Stock:</strong> {item.stock}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
