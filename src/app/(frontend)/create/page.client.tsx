'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { handleSaveScenarioAction, type Message, type UISettings } from '@/actions/index'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Trash2, Plus, Save } from 'lucide-react'

interface Props {
  initialUserId: string
  initialBalance: number
}

const CreateScenarioClient: React.FC<Props> = ({ initialUserId, initialBalance }) => {
  const router = useRouter()
  const [tokenBalance, setTokenBalance] = useState(initialBalance)
  const [isSaving, setIsSaving] = useState(false)

  // -- State --
  const [uiSettings, setUiSettings] = useState<UISettings>({
    recipientName: 'John Doe',
    deviceFrame: 'iPhone15Pro',
    chatType: 'iMessage',
    darkTheme: false,
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      text: 'Hey! How are you?',
      isUserMessage: false,
      timestamp: '10:30 AM',
      status: 'none',
    },
  ])

  // -- Handlers --

  const addMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: '',
        isUserMessage: true, // Default to user reply
        timestamp: 'Delivered',
        status: 'read',
      },
    ])
  }

  const removeMessage = (id: number | undefined) => {
    if (!id) return
    setMessages(messages.filter((m) => m.id !== id))
  }

  const updateMessage = (id: number | undefined, field: keyof Message, value: any) => {
    if (!id) return
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const handleSave = async () => {
    if (tokenBalance < 2) {
      alert('Insufficient tokens! Please top up.')
      return
    }

    setIsSaving(true)
    try {
      const result = await handleSaveScenarioAction(uiSettings, messages)

      if (result.success && result.newBalance !== undefined) {
        setTokenBalance(result.newBalance)
        alert('Scenario saved successfully! 2 Tokens deducted.')
        router.refresh() 
      } else {
        alert(`Failed: ${result.error}`)
      }
    } catch (error) {
      console.error(error)
      alert('An unexpected error occurred.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header / Stats */}
      <div className="flex justify-between items-center p-4 bg-muted rounded-lg border">
        <div>
          <p className="text-sm font-medium text-muted-foreground">User ID</p>
          <code className="text-xs">{initialUserId}</code>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">Balance</p>
          <p className="text-2xl font-bold text-primary">{tokenBalance} Tokens</p>
        </div>
      </div>

      {/* Settings Section */}
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">1. Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Recipient Name</Label>
            <Input
              value={uiSettings.recipientName}
              onChange={(e) =>
                setUiSettings({ ...uiSettings, recipientName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Device Frame</Label>
            <Select
              value={uiSettings.deviceFrame || 'iPhone15Pro'}
              onValueChange={(val: any) =>
                setUiSettings({ ...uiSettings, deviceFrame: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iPhone15Pro">iPhone 15 Pro</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Chat Type</Label>
            <Select
              value={uiSettings.chatType || 'iMessage'}
              onValueChange={(val: any) =>
                setUiSettings({ ...uiSettings, chatType: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iMessage">iMessage (Blue)</SelectItem>
                <SelectItem value="SMS">SMS (Green)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id="darkTheme"
              checked={uiSettings.darkTheme || false}
              onCheckedChange={(checked) =>
                setUiSettings({ ...uiSettings, darkTheme: checked as boolean })
              }
            />
            <Label htmlFor="darkTheme">Dark Mode</Label>
          </div>
        </div>
      </Card>

      {/* Messages Section */}
      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">2. Messages</h2>
          <Button onClick={addMessage} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Add Message
          </Button>
        </div>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex gap-4 items-start p-4 border rounded-lg bg-card/50"
            >
              <div className="flex-grow space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-2">
                    <Label>Message Text</Label>
                    <Textarea
                      value={msg.text}
                      onChange={(e) => updateMessage(msg.id, 'text', e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="w-1/2 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Time / Label</Label>
                      <Input
                        value={msg.timestamp || ''}
                        onChange={(e) =>
                          updateMessage(msg.id, 'timestamp', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={msg.status || 'none'}
                        onValueChange={(val) => updateMessage(msg.id, 'status', val)}
                        disabled={!msg.isUserMessage}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="none">Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`isUser-${msg.id}`}
                    checked={msg.isUserMessage || false}
                    onCheckedChange={(checked) =>
                      updateMessage(msg.id, 'isUserMessage', checked)
                    }
                  />
                  <Label htmlFor={`isUser-${msg.id}`}>
                    Sent by Me (Right side)
                  </Label>
                </div>
              </div>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeMessage(msg.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 pb-20">
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isSaving || tokenBalance < 2}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Scenario (2 Tokens)'}
        </Button>
      </div>
    </div>
  )
}

export default CreateScenarioClient