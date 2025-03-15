"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Save, Trash2, Phone, AlertCircle } from "lucide-react"

export function EmergencyContactSettings() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState([
    {
      id: "1",
      name: "James Wilson",
      relationship: "Sponsor",
      phone: "555-987-6543",
      email: "james@example.com",
    },
    {
      id: "2",
      name: "Dr. Sarah Johnson",
      relationship: "Therapist",
      phone: "555-123-4567",
      email: "dr.johnson@example.com",
    },
  ])

  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  })

  const [isAddingContact, setIsAddingContact] = useState(false)

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([
        ...contacts,
        {
          id: `${contacts.length + 1}`,
          ...newContact,
        },
      ])

      setNewContact({
        name: "",
        relationship: "",
        phone: "",
        email: "",
      })

      setIsAddingContact(false)

      toast({
        title: "Contact added",
        description: "Emergency contact has been added successfully.",
        variant: "success",
      })
    }
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id))

    toast({
      title: "Contact removed",
      description: "Emergency contact has been removed.",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewContact((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    toast({
      title: "Emergency contacts updated",
      description: "Your emergency contacts have been saved.",
      variant: "success",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle>Emergency Contacts</CardTitle>
        </div>
        <CardDescription>Add people who should be contacted in case of an emergency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-start gap-4 p-4 border rounded-md">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <span className="text-sm">{contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isAddingContact ? (
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium">Add New Contact</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newContact.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  name="relationship"
                  value={newContact.relationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Sponsor, Family member"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newContact.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact}>Add Contact</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setIsAddingContact(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Emergency Contact
          </Button>
        )}

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Crisis Resources</h3>

          <div className="space-y-3">
            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium">National Crisis Hotline</h4>
                  <p className="text-sm text-muted-foreground">Available 24/7 for immediate support</p>
                  <p className="font-medium mt-1">1-800-273-8255</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600 dark:text-red-400"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Crisis Text Line</h4>
                  <p className="text-sm text-muted-foreground">Text support for crisis situations</p>
                  <p className="font-medium mt-1">Text HOME to 741741</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Emergency Contacts
        </Button>
      </CardFooter>
    </Card>
  )
}

