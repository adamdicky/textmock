'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, Download, PlusCircle } from 'lucide-react'

interface DashboardProps {
  user: {
    userName: string
    tokenBalance: number
  }
  scenarios: any[]
}

const DashboardClient: React.FC<DashboardProps> = ({ user, scenarios }) => {
  return (
    <div className="container py-10 max-w-6xl">
      
      {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-bold">My Scenarios</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back, <span className="font-semibold text-foreground">{user.userName}</span>
                </p>
            </div>
            
            <div className="flex items-center gap-4 bg-muted p-3 rounded-xl border">
                <div className="text-right px-2">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Balance</p>
                    <p className="text-xl font-bold text-primary">{user.tokenBalance} Tokens</p>
                </div>
                <Button asChild>
                    <Link href="/create">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Scenario
                    </Link>
                </Button>
            </div>
        </div>

      {/* Grid */}
      {scenarios.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-lg text-muted-foreground mb-4">You haven't created any scenarios yet.</p>
            <Button asChild variant="outline">
                <Link href="/create">Create your first one.</Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((item) => {
                // Safe access to image URL
                let imageUrl = null;

                // Check if previewImage exists and is an object
                if (item.previewImage && typeof item.previewImage === 'object') {
                    
                    // 1. Try the direct URL provided by Payload
                    if (item.previewImage.url) {
                        imageUrl = item.previewImage.url;
                    } 
                    // 2. Fallback: Construct URL from filename if URL is missing
                    // Note: We assume '/media/' is the correct path prefix based on your collection config
                    else if (item.previewImage.filename) {
                        imageUrl = `/media/${item.previewImage.filename}`;
                    }
                }
                
                return (
                <Card key={item.id} className="overflow-hidden flex flex-col">
                    {/* Screenshot Preview */}
                    <div className="relative aspect-[9/16] bg-zinc-100 dark:bg-zinc-900 border-b">
                    {imageUrl ? (
                        <img 
                        src={imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            <span>No Preview</span>
                        </div>
                    )}
                    </div>

                    {/* Info & Actions */}
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg truncate mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </p>

                        <div className="mt-auto flex gap-2">
                            {/* Edit Button (Consumes Tokens logic would be on the create page re-save) */}
                            <Button variant="outline" className="flex-1" disabled>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit (2 Token)
                            </Button>

                            {/* Download Button */}
                            {imageUrl && (
                            <Button variant="secondary" size="icon" asChild>
                                <a href={imageUrl} download={`scenario-${item.id}.png`} target="_blank">
                                    <Download className="w-4 h-4" />
                                </a>
                            </Button>
                            )}
                        </div>
                    </div>
                </Card>
                )
            })}
        </div>
      )}
    </div>
  )
}

export default DashboardClient