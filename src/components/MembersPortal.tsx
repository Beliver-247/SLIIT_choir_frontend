import { Calendar, Music, Clipboard, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import PracticeSchedules from "./PracticeSchedules";
import { getCurrentMember, hasRole } from "../utils/roleUtils";
import ScheduleAttendanceModal from "./ScheduleAttendanceModal";
import MerchandiseCatalog from "./MerchandiseCatalog";
import MerchandiseManagement from "./MerchandiseManagement";
import OrderCheckout from "./OrderCheckout";
import MyOrders from "./MyOrders";
import OrderManagement from "./OrderManagement";
import ResourceManagement from "./ResourceManagement";
import ResourceBrowser from "./ResourceBrowser";
import { useState } from "react";

interface PracticeSchedule {
  _id: string;
  title: string;
  description?: string;
  date: string;
  timePeriod: {
    startTime: string;
    endTime: string;
  };
  location: {
    lectureHallId: string;
  };
  status: string;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface MembersPortalProps {
  memberName: string;
}

export function MembersPortal({ memberName }: MembersPortalProps) {
  const [selectedScheduleForAttendance, setSelectedScheduleForAttendance] = useState<PracticeSchedule | null>(null);
  const [showMerchandiseManagement, setShowMerchandiseManagement] = useState(false);
  const [showOrderManagement, setShowOrderManagement] = useState(false);
  const [checkoutCart, setCheckoutCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const isAdmin = hasRole(['admin', 'moderator']);

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
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
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
                <PracticeSchedules 
                  onScheduleSelect={(schedule) => {
                    if (hasRole(['moderator', 'admin'])) {
                      setSelectedScheduleForAttendance(schedule);
                    }
                  }}
                />

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
            {showMerchandiseManagement ? (
              <MerchandiseManagement onBack={() => setShowMerchandiseManagement(false)} />
            ) : showOrderManagement ? (
              <div className="space-y-4">
                <Button variant="outline" onClick={() => setShowOrderManagement(false)}>
                  Back to Merchandise
                </Button>
                <OrderManagement />
              </div>
            ) : (
              <>
                {isAdmin && (
                  <div className="flex gap-2 justify-end">
                    <Button onClick={() => setShowOrderManagement(true)} variant="outline">
                      Manage Orders
                    </Button>
                  </div>
                )}
                <MerchandiseCatalog 
                  onOrderNow={(cart) => {
                    setCheckoutCart(cart);
                    setShowCheckout(true);
                  }}
                  onManageClick={() => setShowMerchandiseManagement(true)}
                />
                <MyOrders />
              </>
            )}
          </TabsContent>

          {/* Checkout Modal */}
          {showCheckout && checkoutCart.length > 0 && (
            <OrderCheckout
              cart={checkoutCart}
              onSuccess={() => {
                setShowCheckout(false);
                setCheckoutCart([]);
              }}
              onCancel={() => {
                setShowCheckout(false);
              }}
            />
          )}

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            {isAdmin ? <ResourceManagement /> : <ResourceBrowser />}
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-blue-600" />
                  Attendance Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasRole(['moderator', 'admin']) ? (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => {
                        window.history.pushState({}, "", "/attendance-analytics");
                        window.dispatchEvent(new PopStateEvent("popstate"));
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      View Analytics
                    </Button>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4">
                      <p className="text-sm text-blue-900">
                        As a moderator/admin, you can mark attendance for members and view comprehensive analytics including attendance rates, trends, and export data to Excel.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-900 font-medium mb-3">Your Attendance</p>
                      <p className="text-sm text-blue-700 mb-4">
                        View your personal attendance record and statistics across all events and practice sessions.
                      </p>
                      <Button 
                        onClick={() => {
                          const member = getCurrentMember();
                          if (member) {
                            window.history.pushState({}, "", `/member-report/${member._id}`);
                            window.dispatchEvent(new PopStateEvent("popstate"));
                          }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        View My Attendance
                      </Button>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-amber-900 text-sm">
                        📊 Attendance analytics and management features are available only for moderators and administrators.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Attendance Modal */}
        {selectedScheduleForAttendance && (
          <ScheduleAttendanceModal
            isOpen={!!selectedScheduleForAttendance}
            scheduleId={selectedScheduleForAttendance._id}
            scheduleTitle={selectedScheduleForAttendance.title}
            onClose={() => setSelectedScheduleForAttendance(null)}
          />
        )}
      </div>
    </div>
  );
}
