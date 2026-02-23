
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap, Target } from 'lucide-react';

export default function MobileControls({ category, onAction }) {
    const [touchType, setTouchType] = useState(null);
    const swipeRef = useRef({ x: 0, y: 0, startTime: 0 });

    useEffect(() => {
        // Detect if we should show D-pad, Swipe Zone, or just be transparent
        if (['shooter', 'racing', 'fighting'].includes(category)) {
            setTouchType('virtual-dpad');
        } else if (category === 'platformer') {
            setTouchType('swipe');
        } else {
            setTouchType('direct');
        }
    }, [category]);

    const handleSwipeStart = (e) => {
        const touch = e.touches[0];
        swipeRef.current = { x: touch.clientX, y: touch.clientY, startTime: Date.now() };
    };

    const handleSwipeEnd = (e) => {
        const touch = e.changedTouches[0];
        const dx = touch.clientX - swipeRef.current.x;
        const dy = touch.clientY - swipeRef.current.y;
        const dt = Date.now() - swipeRef.current.startTime;

        if (dt < 300) { // Fast swipe
            if (Math.abs(dy) > Math.abs(dx) && dy < -30) {
                onAction('jump');
            } else if (Math.abs(dx) > 30) {
                onAction(dx > 0 ? 'move-right' : 'move-left');
            }
        }
    };

    if (touchType === 'direct') return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 select-none">
            <AnimatePresence>
                {touchType === 'virtual-dpad' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end pointer-events-auto"
                    >
                        {/* Virtual D-Pad */}
                        <div className="grid grid-cols-3 gap-2 opacity-80 active:opacity-100 transition-opacity">
                            <div />
                            <ControlBtn icon={<ChevronUp />} onTouchStart={() => onAction('hold-up')} onTouchEnd={() => onAction('release-up')} />
                            <div />
                            <ControlBtn icon={<ChevronLeft />} onTouchStart={() => onAction('hold-left')} onTouchEnd={() => onAction('release-left')} />
                            <ControlBtn icon={<ChevronDown />} onTouchStart={() => onAction('hold-down')} onTouchEnd={() => onAction('release-down')} />
                            <ControlBtn icon={<ChevronRight />} onTouchStart={() => onAction('hold-right')} onTouchEnd={() => onAction('release-right')} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 items-end">
                            <div className="flex flex-col items-center gap-2">
                                <ControlBtn
                                    icon={<Target className="w-8 h-8" />}
                                    onTouchStart={() => onAction('hold-fire')}
                                    onTouchEnd={() => onAction('release-fire')}
                                    className="size-20 bg-primary/40 text-white rounded-full border-2 border-primary/60"
                                />
                                <span className="text-[10px] font-black tracking-[0.2em] text-white/50 uppercase">
                                    {category === 'fighting' ? 'ATTACK' : 'FIRE'}
                                </span>
                            </div>

                            {category === 'racing' && (
                                <div className="flex flex-col items-center gap-2">
                                    <ControlBtn
                                        icon={<Zap className="w-8 h-8" />}
                                        onTouchStart={() => onAction('hold-boost')}
                                        onTouchEnd={() => onAction('release-boost')}
                                        className="size-16 bg-secondary/40 text-white rounded-full border-2 border-secondary/60"
                                    />
                                    <span className="text-[10px] font-black tracking-[0.2em] text-white/50 uppercase">BOOST</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {touchType === 'swipe' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 pointer-events-auto flex flex-col items-center justify-end pb-12"
                        onTouchStart={handleSwipeStart}
                        onTouchEnd={handleSwipeEnd}
                    >
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">
                            Swipe to jump • Hold to run
                        </div>
                        {/* Transparent Movement Zones */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 flex">
                            <div
                                className="flex-1 active:bg-white/5 transition-colors"
                                onTouchStart={() => onAction('hold-left')}
                                onTouchEnd={() => onAction('release-left')}
                            />
                            <div
                                className="flex-1 active:bg-white/5 transition-colors"
                                onTouchStart={() => onAction('hold-right')}
                                onTouchEnd={() => onAction('release-right')}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ControlBtn({ icon, onTouchStart, onTouchEnd, className = "" }) {
    return (
        <button
            onPointerDown={(e) => {
                e.preventDefault();
                if (onTouchStart) onTouchStart();
            }}
            onPointerUp={(e) => {
                e.preventDefault();
                if (onTouchEnd) onTouchEnd();
            }}
            onPointerLeave={(e) => {
                e.preventDefault();
                if (onTouchEnd) onTouchEnd();
            }}
            className={`size-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center text-white active:bg-primary/50 active:border-primary/80 active:scale-95 transition-all shadow-lg ${className}`}
        >
            {icon}
        </button>
    );
}
