import React from 'react';
import {Smartphone, Shield, Zap, Globe} from 'lucide-react';

//Map string value to Lucide icons
const iconMap: Record<string, any> ={
    smartphone: Smartphone,
    shield: Shield,
    zap: Zap,
    globe: Globe,
}

export const FeaturesBlock: React.FC<any> = ({title, items}) => {
    return(
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="container px-4 mx-auto">
                {title && (
                <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-100">
                    {title}
                </h2>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items?.map((item: any, i: number) => {
                    const Icon = iconMap[item.icon] || Zap
                    
                    return (
                    <div key={i} className="p-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                        <Icon size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    )
                })}
                </div>
            </div>
        </section>
    )
}