import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCustomers, getServices, getAppointments, getInvoices, chat } from "@/lib/api";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function Dashboard() {
  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: getCustomers });
  const { data: services } = useQuery({ queryKey: ['services'], queryFn: getServices });
  const { data: appointments } = useQuery({ queryKey: ['appointments'], queryFn: getAppointments });
  const { data: invoices } = useQuery({ queryKey: ['invoices'], queryFn: getInvoices });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI business assistant. How can I help you manage your business today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalCustomers = customers?.data?.length || 0;
  const activeServices = services?.data?.length || 0;
  const todaysAppointments = appointments?.data?.filter((apt: any) => apt.date === new Date().toISOString().split('T')[0]).length || 0;
  const today = new Date().toISOString().split('T')[0];
  const totalRevenue = invoices?.data?.filter((inv: any) => inv.status === 'paid' && inv.created_date.startsWith(today)).reduce((sum: number, inv: any) => sum + inv.total_amount, 0) || 0;

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chat(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const quickActions = [
    { label: 'Update Hours', message: 'Change my business hours to 9 AM - 5 PM Monday through Friday' },
    { label: 'Add Service', message: 'Add a new service: Deep Tissue Massage for $150, 60 minutes' },
    { label: 'Update Price', message: 'Increase the price of facial treatment to $120' },
    { label: 'Mark Closed', message: 'I will be closed tomorrow for a private event' },
    { label: 'Update Contact', message: 'Update my phone number to 555-0123' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Business Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="font-semibold">Total Customers</h3>
          <p className="text-2xl">{totalCustomers}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Active Services</h3>
          <p className="text-2xl">{activeServices}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Today's Appointments</h3>
          <p className="text-2xl">{todaysAppointments}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Revenue</h3>
          <p className="text-2xl">${totalRevenue}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={() => sendMessage(action.message)}
                className="justify-start text-left"
                variant="outline"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* AI Chat */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">AI Business Assistant</h3>
          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto mb-4 p-2 border rounded">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 p-2 rounded ${
                    message.sender === 'user'
                      ? 'bg-blue-100 ml-8'
                      : 'bg-gray-100 mr-8'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-100 mr-8 p-2 rounded">
                  <p className="text-sm">Processing your request...</p>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}