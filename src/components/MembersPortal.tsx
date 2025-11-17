import { Calendar, ShoppingBag, Download, Music } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import PracticeSchedules from "./PracticeSchedules";

interface MembersPortalProps {
  memberName: string;
}

export function MembersPortal({ memberName }: MembersPortalProps) {
  const tshirtDesigns = [
    {
      id: 1,
      name: "Official Choir T-Shirt 2025",
      description: "Navy blue with gold SLIIT Choir logo",
      price: "LKR 1,500",
      image:
        "https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0LXNoaXJ0JTIwbW9ja3VwfGVufDF8fHx8MTc2MzMzNTQxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      available: true,
    },
    {
      id: 2,
      name: "Performance Polo Shirt",
      description: "White polo with embroidered logo",
      price: "LKR 2,200",
      image:
        "https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0LXNoaXJ0JTIwbW9ja3VwfGVufDF8fHx8MTc2MzMzNTQxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      sizes: ["S", "M", "L", "XL", "XXL"],
      available: true,
    },
    {
      id: 3,
      name: "Carol Service Special Edition",
      description: "Limited edition black with festive design",
      price: "LKR 1,800",
      image:
        "https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0LXNoaXJ0JTIwbW9ja3VwfGVufDF8fHx8MTc2MzMzNTQxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      sizes: ["XS", "S", "M", "L", "XL"],
      available: true,
    },
  ];

  const resources = [
    {
      title: "Sheet Music - Christmas Carols 2025",
      type: "PDF",
      size: "2.4 MB",
      updated: "Nov 10, 2025",
    },
    {
      title: "Vocal Warm-up Exercises",
      type: "PDF",
      size: "890 KB",
      updated: "Oct 15, 2025",
    },
    {
      title: "Performance Guidelines",
      type: "PDF",
      size: "1.2 MB",
      updated: "Sep 20, 2025",
    },
    {
      title: "Choir Member Handbook 2025",
      type: "PDF",
      size: "3.1 MB",
      updated: "Aug 1, 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-blue-900 mb-2">Welcome back, {memberName}!</h1>
          <p className="text-gray-600 text-xl">
            Access your practice schedules, resources, and merchandise
          </p>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Practice Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Practice Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Real data from backend */}
                <PracticeSchedules />

                {/* Attendance Policy */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Music className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-blue-900 mb-1">Attendance Policy</div>
                      <p className="text-sm text-blue-700">
                        Please ensure you attend at least 80% of practice sessions. If you cannot
                        attend, inform the conductor at least 24 hours in advance.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Merchandise Tab */}
          <TabsContent value="merchandise" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  Official Merchandise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tshirtDesigns.map((design) => (
                    <div
                      key={design.id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-square bg-gray-100 relative">
                        <ImageWithFallback
                          src={design.image}
                          alt={design.name}
                          className="w-full h-full object-cover"
                        />
                        {design.available && (
                          <Badge className="absolute top-3 right-3 bg-green-500">
                            Available
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-blue-900 mb-2">{design.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{design.description}</p>

                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-2">Available Sizes:</div>
                          <div className="flex flex-wrap gap-2">
                            {design.sizes.map((size) => (
                              <span
                                key={size}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-blue-900">{design.price}</span>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Order Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-blue-900 mb-2">Order Information</div>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Orders will be processed within 2-3 weeks</li>
                    <li>Pick up from the choir coordinator during practice</li>
                    <li>Payment can be made via bank transfer or cash</li>
                    <li>Contact choir@sliit.lk for bulk orders</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  Member Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Download className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-blue-900 mb-1">{resource.title}</div>
                          <div className="text-sm text-gray-600">
                            {resource.type} • {resource.size} • Updated {resource.updated}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <h3 className="text-blue-900 mb-2">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#" className="text-blue-600 hover:text-blue-700">
                          Member Directory
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:text-blue-700">
                          Attendance Records
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:text-blue-700">
                          Payment History
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:text-blue-700">
                          Contact Coordinator
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <h3 className="text-purple-900 mb-2">Upcoming Events</h3>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li>• Foundation Day - Dec 15</li>
                      <li>• Carol Service - Dec 20</li>
                      <li>• Inter-Uni Festival - Jan 25</li>
                      <li>• Team Building - Feb 10</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
