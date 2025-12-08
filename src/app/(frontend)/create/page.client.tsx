'use client'

import React, { useState, useEffect, useRef } from 'react'
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
import { Trash2, Plus, Save, Battery, Wifi, Signal } from 'lucide-react'
import { cn } from '@/utilities/ui'

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
    {
      id: Date.now() + 1,
      text: 'I\'m doing great, thanks for asking!',
      isUserMessage: true,
      timestamp: 'Delivered',
      status: 'read',
    },
  ])

  // -- Handlers --
  const addMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: '',
        isUserMessage: true,
        timestamp: '',
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
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* --- LEFT COLUMN: EDITOR --- */}
      <div className="w-full lg:w-1/2 space-y-8">
        
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
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label>Recipient Name</Label>
              <Input
                value={uiSettings.recipientName}
                onChange={(e) =>
                  setUiSettings({ ...uiSettings, recipientName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

               <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex items-center space-x-2 h-10 border rounded-md px-3">
                    <Checkbox
                    id="darkTheme"
                    checked={uiSettings.darkTheme || false}
                    onCheckedChange={(checked) =>
                        setUiSettings({ ...uiSettings, darkTheme: checked as boolean })
                    }
                    />
                    <Label htmlFor="darkTheme" className="cursor-pointer">Dark Mode</Label>
                </div>
              </div>
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

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className="flex flex-col gap-3 p-4 border rounded-lg bg-card/50 relative group"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:bg-destructive/10"
                    onClick={() => removeMessage(msg.id)}
                    >
                    <Trash2 className="w-3 h-3" />
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`isUser-${msg.id}`}
                            checked={msg.isUserMessage || false}
                            onCheckedChange={(checked) =>
                            updateMessage(msg.id, 'isUserMessage', checked)
                            }
                        />
                        <Label htmlFor={`isUser-${msg.id}`} className="text-xs font-medium text-muted-foreground">
                            Sent by Me
                        </Label>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
                </div>

                <Textarea
                    value={msg.text}
                    onChange={(e) => updateMessage(msg.id, 'text', e.target.value)}
                    rows={2}
                    placeholder="Type a message..."
                    className="resize-none"
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs">Time / Label</Label>
                        <Input
                        className="h-8 text-xs"
                        value={msg.timestamp || ''}
                        onChange={(e) =>
                            updateMessage(msg.id, 'timestamp', e.target.value)
                        }
                        placeholder="e.g. 10:30 AM"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs">Status (My Msg Only)</Label>
                        <Select
                        value={msg.status || 'none'}
                        onValueChange={(val) => updateMessage(msg.id, 'status', val)}
                        disabled={!msg.isUserMessage}
                        >
                        <SelectTrigger className="h-8 text-xs">
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
            ))}
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pb-20">
          <Button 
            size="lg" 
            onClick={handleSave} 
            disabled={isSaving || tokenBalance < 2}
            className="w-full lg:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Scenario (2 Tokens)'}
          </Button>
        </div>
      </div>

      {/* --- RIGHT COLUMN: PREVIEW --- */}
      <div className="w-full lg:w-1/2 flex justify-center sticky top-10">
         <PhonePreview settings={uiSettings} messages={messages} />
      </div>

    </div>
  )
}

// --- SUB-COMPONENT: Phone Preview ---

const PhonePreview = ({ settings, messages }: { settings: UISettings, messages: Message[] }) => {
    const isDark = settings.darkTheme;
    const isSMS = settings.chatType === 'SMS';
    const userBubbleColor = isSMS ? 'bg-green-500 text-white' : 'bg-blue-500 text-white';
    
    // Base classes for the phone "screen"
    const screenBase = cn(
        "w-full h-full overflow-hidden flex flex-col font-sans",
        isDark ? "bg-black text-white" : "bg-white text-black"
    );

    return (
        <div className="relative">
             {/* Device Frame (Optional) */}
             <div className={cn(
                 "relative w-[320px] h-[650px] sm:w-[375px] sm:h-[812px] bg-black rounded-[50px] shadow-2xl border-[8px] border-zinc-800 overflow-hidden",
                 "ring-1 ring-white/10" // subtle highlight
             )}>
                 {/* Dynamic Island / Notch area */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[35px] w-[120px] bg-black z-20 rounded-b-3xl"></div>

                 {/* Screen Content */}
                 <div className={screenBase}>
                     
                     {/* iOS Status Bar (Mock) */}
                     <div className="h-12 px-6 flex justify-between items-end pb-2 text-[12px] font-semibold z-10">
                        <span>9:41</span>
                        <div className="flex gap-1.5 items-center">
                            <Signal className="w-3.5 h-3.5" />
                            <Wifi className="w-3.5 h-3.5" />
                            <Battery className="w-4 h-4" />
                        </div>
                     </div>

                     {/* Navigation Bar */}
                     <div className={cn(
                         "h-12 flex flex-col items-center justify-center z-10 backdrop-blur-md bg-opacity-80 border-b",
                         isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-100/50 border-zinc-200"
                     )}>
                         <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-sm font-medium text-white mb-0.5">
                                {settings.recipientName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[10px] opacity-70">
                                {settings.recipientName} &gt;
                            </span>
                         </div>
                     </div>

                     {/* Chat Area */}
                     <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                         {/* Default 'iMessage' label at top */}
                         <div className="text-center py-4">
                             <span className="text-[10px] text-gray-500 font-medium">
                                 {isSMS ? 'Text Message' : 'iMessage'}
                             </span>
                             <div className="text-[10px] text-gray-400 mt-1">
                                 Today 10:25 AM
                             </div>
                         </div>

                         {messages.map((msg, i) => (
                             <div key={msg.id || i} className={cn(
                                 "flex flex-col max-w-[75%]",
                                 msg.isUserMessage ? "ml-auto items-end" : "mr-auto items-start"
                             )}>
                                 {/* Message Bubble */}
                                 <div className={cn(
                                     "px-4 py-2 rounded-2xl text-[15px] leading-snug",
                                     msg.isUserMessage 
                                        ? `${userBubbleColor} rounded-br-sm` 
                                        : (isDark ? "bg-zinc-800 text-white rounded-bl-sm" : "bg-gray-200 text-black rounded-bl-sm")
                                 )}>
                                     {msg.text || "..."}
                                 </div>

                                 {/* Timestamp / Status (Only show if set) */}
                                 {msg.timestamp && (
                                     <span className={cn(
                                         "text-[10px] mt-1 font-medium px-1",
                                         msg.isUserMessage ? "text-right" : "text-left",
                                         isDark ? "text-gray-500" : "text-gray-400"
                                     )}>
                                        {msg.isUserMessage && msg.status === 'read' ? 'Read ' : ''}
                                        {msg.isUserMessage && msg.status === 'delivered' ? 'Delivered ' : ''}
                                        {msg.timestamp}
                                     </span>
                                 )}
                             </div>
                         ))}
                         {/* Spacer for bottom input area */}
                         <div className="h-4" />
                     </div>

                     {/* Bottom Input Area (Mock) */}
                     <div className={cn(
                         "min-h-[50px] px-4 py-2 flex items-center gap-3 z-10",
                         isDark ? "bg-black" : "bg-white"
                     )}>
                         <div className={cn("w-8 h-8 rounded-full flex-shrink-0 items-center flex justify-center", isDark ? "bg-zinc-800" : "bg-gray-200")}>
                                <Plus />
                         </div>
                         <div className={cn(
                             "flex-1 h-9 rounded-full border px-3 flex items-center text-sm text-muted-foreground",
                             isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white"
                         )}>
                             iMessage
                         </div>
                     </div>
                     
                     {/* Home Bar */}
                     <div className="h-[20px] flex justify-center items-center">
                         <div className="w-[120px] h-[5px] bg-gray-500/50 rounded-full"></div>
                     </div>
                 </div>
             </div>
        </div>
    )
}

export default CreateScenarioClient