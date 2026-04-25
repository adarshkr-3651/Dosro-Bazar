"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getConversations, getMessages, sendChatMessage, deleteChatMessage, deleteConversation } from "@/app/lib/api";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { Send, ArrowLeft, MoreVertical, Package, MapPin, Loader2, MessageSquare, Image as ImageIcon, X, Eye, EyeOff, Trash2, User as UserIcon, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { resolvePhotoUrl } from "../lib/image-utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { uploadChatImage, toggleOnlineStatus } from "@/app/lib/api";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";

export default function MessagesPage() {
    const { user, loading: authLoading } = useAuth();
    const isAuthenticated = !!user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemIdParam = searchParams.get("itemId");
    const sellerIdParam = searchParams.get("sellerId");

    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConv, setSelectedConv] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [showChatOptions, setShowChatOptions] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [dontAskAgain, setDontAskAgain] = useState(false);
    
    // Full Flex Enhancements State
    const [isOnline, setIsOnline] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const selectedConvRef = useRef<any>(null);
    const autoSelectedRef = useRef(false);

    // Sync ref with state
    useEffect(() => {
        selectedConvRef.current = selectedConv;
    }, [selectedConv]);

    const fetchConversationsRef = useRef<any>(null);

    // Sync online preference from user object
    useEffect(() => {
        if (user && 'isOnlineVisible' in user) {
            setIsOnline(user.isOnlineVisible as boolean);
        }
    }, [user]);

    const handleSelectConversation = useCallback(async (conv: any) => {
        setSelectedConv(conv);
        setLoadingMessages(true);
        try {
            const res: any = await getMessages(conv._id);
            setMessages(res.data);

            // Join specific conversation room (optional, depending on backend implementation)
            if (socketRef.current) {
                socketRef.current.emit("joinConversation", conv._id);
            }

            // Refresh conversation list to clear unread counts if any
            fetchConversationsRef.current?.();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to load messages");
        } finally {
            setLoadingMessages(false);
        }
    }, []); // Removed fetchConversations from dependencies to avoid circularity


    const fetchConversations = useCallback(async () => {
        if (!isAuthenticated) return;
        
        try {
            const res: any = await getConversations();
            const convs = res.data;
            setConversations(convs);

            // Auto-select conversation based on query parameters
            if (itemIdParam && sellerIdParam && !autoSelectedRef.current) {
                const targetConv = convs.find((c: any) => 
                    c.item?._id === itemIdParam && 
                    c.participants.some((p: any) => p._id === sellerIdParam)
                );
                if (targetConv) {
                    autoSelectedRef.current = true;
                    handleSelectConversation(targetConv);
                }
            }
        } catch (error: any) {
            console.error(error);
            // Don't toast if it's just an auth error, the redirect will handle it
            if (!error.message.includes("authorized") && !error.message.includes("login")) {
                toast.error("Failed to load conversations");
            }
        } finally {
            setLoadingConvs(false);
        }
    }, [isAuthenticated, itemIdParam, sellerIdParam, handleSelectConversation]);

    useEffect(() => {
        fetchConversationsRef.current = fetchConversations;
    }, [fetchConversations]);

    // Initial auth check and socket connection
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth/login?redirect=/messages");
            return;
        }

        if (isAuthenticated && user) {
            fetchConversations();

            // Connect to Socket.IO using the base URL
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            // Make sure not to include '/api' at the end of the URL for Socket.IO
            const socketUrl = apiUrl.replace(/\/api\/?$/, "");

            socketRef.current = io(socketUrl, {
                withCredentials: true
            });

            socketRef.current.on("connect", () => {
                socketRef.current?.emit("joinUserRoom", user._id);
            });

            socketRef.current.on("newMessage", (data: any) => {
                const { message, conversationId, itemId } = data;

                // If it's the currently open conversation, append the message
                setMessages(prev => {
                    // Check if it's already in the list
                    if (prev.find(m => m._id === message._id)) return prev;

                    if (selectedConvRef.current && selectedConvRef.current._id === conversationId) {
                        return [...prev, message];
                    }
                    return prev;
                });

                // Update conversation list
                fetchConversations();
            });

            socketRef.current.on("userOnline", (userId: string) => {
                // Refresh conversations to see the green dot
                fetchConversations();
            });

            socketRef.current.on("userOffline", (userId: string) => {
                // Refresh conversations to hide the green dot
                fetchConversations();
            });

            socketRef.current.on("messageDeleted", ({ messageId, conversationId }: any) => {
                if (selectedConvRef.current && selectedConvRef.current._id === conversationId) {
                    setMessages(prev => prev.filter(m => m._id !== messageId));
                }
                fetchConversationsRef.current?.();
            });

            return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }
}, [isAuthenticated, user, authLoading, router, fetchConversations]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleToggleOnline = async (checked: boolean) => {
        setIsOnline(checked);
        try {
            await toggleOnlineStatus(checked);
            toast.success(`You are now ${checked ? 'visible' : 'hidden'} to others`);
        } catch (error) {
            setIsOnline(!checked);
            toast.error("Failed to update visibility");
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleShareLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }
        
        toast.info("Fetching your location...");
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    name: "Shared Location"
                };
                const otherParticipant = selectedConv.participants.find((p: any) => p._id !== user?._id);
                if (!otherParticipant) return;

                const res: any = await sendChatMessage(otherParticipant._id, selectedConv.item._id, undefined, undefined, location);
                setMessages(prev => [...prev, res.data]);
                fetchConversations();
                toast.success("Location shared!");
            } catch(err) {
                toast.error("Failed to share location");
            }
        }, () => {
            toast.error("Unable to retrieve your location. Please check browser permissions.");
        });
    };

    const handleShareDetailsClick = () => {
        // Check localStorage for preference
        const skipConfirmation = localStorage.getItem("skipShareDetailsConfirm") === "true";
        if (skipConfirmation) {
            confirmShareDetails();
        } else {
            setIsShareModalOpen(true);
        }
    };

    const confirmShareDetails = async () => {
        if (!selectedConv || !user) return;
        
        setIsSharing(true);

        // Save preference if checkbox is ticked
        if (dontAskAgain) {
            localStorage.setItem("skipShareDetailsConfirm", "true");
        }

        const otherParticipant = selectedConv.participants.find((p: any) => p._id !== user?._id);
        if (!otherParticipant) return;

        const detailsText = `📋 My Contact Details:\nName: ${user.username}\nPhone: ${user.phone || 'N/A'}\nEmail: ${user.email || 'N/A'}`;
        
        try {
            const res: any = await sendChatMessage(otherParticipant._id, selectedConv.item._id, detailsText);
            setMessages(prev => [...prev, res.data]);
            fetchConversations();
            toast.success("Contact details shared!");
            setIsShareModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to share details");
        } finally {
            setIsSharing(false);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!input.trim() && !imageFile) || !selectedConv || isUploading) return;

        const text = input.trim();
        setInput(""); // Optimistically clear input

        const otherParticipant = selectedConv.participants.find((p: any) => p._id !== user?._id);
        if (!otherParticipant) return;

        try {
            let imageUrl = undefined;
            if (imageFile) {
                setIsUploading(true);
                const res = await uploadChatImage(imageFile);
                imageUrl = res.data;
                setImageFile(null);
                setImagePreview(null);
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }

            const res: any = await sendChatMessage(otherParticipant._id, selectedConv.item._id, text, imageUrl);
            // Add the new message to the local state immediately
            setMessages(prev => [...prev, res.data]);
            fetchConversations(); // Refresh list to update "lastMessage"
        } catch (error) {
            setIsUploading(false);
            console.error(error);
            toast.error("Failed to send message");
            setInput(text); // Restore input on failure
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteChatMessage(messageId);
            setMessages(prev => prev.filter(m => m._id !== messageId));
            // toast.success("Message deleted"); // Optional: sometimes too intrusive for deletion
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete message");
        }
    };

    const handleDeleteConversation = () => {
        if (!selectedConv) return;
        setIsDeleteModalOpen(true);
        setShowChatOptions(false);
    };

    const confirmDelete = async () => {
        if (!selectedConv) return;
        
        setIsDeleting(true);
        try {
            await deleteConversation(selectedConv._id);
            setConversations(prev => prev.filter(c => c._id !== selectedConv._id));
            setSelectedConv(null);
            setMessages([]);
            toast.success("Conversation deleted successfully");
            setIsDeleteModalOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to delete conversation");
        } finally {
            setIsDeleting(false);
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-2 max-h-[calc(100vh-80px)] overflow-hidden">
                <Card className="flex flex-col md:flex-row h-[80vh] overflow-hidden shadow-lg border">

                    {/* Left Panel: Conversations List */}
                    <div className={`w-full md:w-1/3 border-r flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                            <h2 className="text-xl font-bold font-heading">Messages</h2>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="online-status" className="text-xs cursor-pointer flex items-center gap-1 text-muted-foreground mr-1">
                                    {isOnline ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                    <span className="hidden sm:inline">{isOnline ? 'Online' : 'Hidden'}</span>
                                </Label>
                                <Switch 
                                    id="online-status" 
                                    checked={isOnline} 
                                    onCheckedChange={handleToggleOnline} 
                                    className="data-[state=checked]:bg-green-500 scale-75"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loadingConvs ? (
                                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                            ) : conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground text-center h-full">
                                    <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No messages yet.</p>
                                    <p className="text-sm">Start a conversation from an item's page!</p>
                                </div>
                            ) : (
                                conversations.map(conv => {
                                    const otherUser = conv.participants.find((p: any) => p._id !== user?._id);
                                    const unreadCount = conv.unreadCount?.[user?._id || ""] || 0;
                                    const isActive = selectedConv?._id === conv._id;

                                    return (
                                        <div
                                            key={conv._id}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 flex gap-3 ${isActive ? 'bg-muted border-l-4 border-l-primary' : ''}`}
                                        >
                                            <div className="relative h-12 w-12 flex-shrink-0">
                                                <div className="h-full w-full rounded-full overflow-hidden border bg-muted flex items-center justify-center font-bold text-muted-foreground text-sm relative">
                                                    {otherUser?.photo && otherUser.photo !== 'user.png' ? (
                                                        <Image
                                                            src={otherUser.photo.startsWith('http') ? otherUser.photo : `/uploads/users/${otherUser.photo}`}
                                                            alt={otherUser.username || "User"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <span>{otherUser?.username?.[0] || "U"}</span>
                                                    )}
                                                </div>
                                                {otherUser?.isOnline && (
                                                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-[2.5px] border-background z-20 shadow-sm" title="Online now"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold truncate text-sm">{otherUser?.username}</h4>
                                                    {unreadCount > 0 && (
                                                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 truncate">
                                                    <Package className="h-3 w-3" />
                                                    <span className="truncate">{conv.item?.title}</span>
                                                </div>
                                                <p className={`text-xs truncate ${unreadCount > 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                                                    {conv.lastMessage?.text || "No messages yet"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Active Chat Window */}
                    <div className={`flex-1 flex flex-col bg-muted/5 ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
                        {!selectedConv ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full">
                                <MessageSquare className="h-16 w-16 mb-4 opacity-10" />
                                <p className="text-lg font-medium">Select a conversation</p>
                                <p className="text-sm">Choose a chat from the left to start messaging</p>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b bg-background flex items-center gap-4 shadow-sm z-10">
                                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConv(null)}>
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <Link 
                                        href={`/products/${selectedConv.item?.slug}`} 
                                        className="flex items-center gap-4 group flex-1 min-w-0"
                                    >
                                        {selectedConv.item?.images?.[0] && (
                                            <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0 border transition-transform group-hover:scale-105 active:scale-95 duration-200 shadow-sm">
                                                <Image
                                                    src={resolvePhotoUrl(selectedConv.item.images[0]) || "/placeholder.png"}
                                                    alt="item"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold truncate leading-tight flex items-center gap-2 group-hover:text-primary transition-colors">
                                                {selectedConv.item?.title}
                                                {selectedConv.participants.find((p: any) => p._id !== user?._id)?.isOnline && (
                                                    <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0 shadow-sm" title="Online now"></span>
                                                )}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:opacity-80 transition-opacity">
                                                <span className="font-semibold text-primary">Rs. {selectedConv.item?.price}</span>
                                                <span>•</span>
                                                <span className="truncate whitespace-nowrap overflow-hidden">with {selectedConv.participants.find((p: any) => p._id !== user?._id)?.username}</span>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="hidden sm:flex text-destructive border-transparent hover:bg-destructive/10 hover:border-destructive transition-colors text-xs h-8"
                                            onClick={() => toast.info('User blocked')}
                                        >
                                            Block
                                        </Button>
                                        <div 
                                            className="relative" 
                                            onBlur={(e) => {
                                                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                                    setShowChatOptions(false);
                                                }
                                            }}
                                        >
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-muted-foreground hover:bg-muted/50 transition-colors"
                                                onClick={() => setShowChatOptions(!showChatOptions)}
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                            
                                            {showChatOptions && (
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-md shadow-xl py-1 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    <button 
                                                        className="w-full text-left px-4 py-2 hover:bg-muted text-sm font-medium transition-colors" 
                                                        onClick={() => {
                                                            toast.info('Chat reported successfully');
                                                            setShowChatOptions(false);
                                                        }}
                                                    >
                                                        Report Chat
                                                    </button>
                                                    <button 
                                                        className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive text-sm font-medium transition-colors" 
                                                        onClick={handleDeleteConversation}
                                                    >
                                                        Delete Conversation
                                                    </button>
                                                    {/* Mobile block button */}
                                                    <button 
                                                        className="sm:hidden w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive text-sm font-medium transition-colors border-t mt-1" 
                                                        onClick={() => {
                                                            toast.info('User blocked'); 
                                                            setShowChatOptions(false);
                                                        }}
                                                    >
                                                        Block User
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {loadingMessages ? (
                                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                                    ) : (
                                        messages.map((msg, idx) => {
                                            const isMe = msg.sender === user?._id;
                                            // Handle edge case where sender might be populated or just ID
                                            const _senderId = msg.sender._id || msg.sender;
                                            const _isMe = _senderId === user?._id;

                                            return (
                                                <div key={msg._id || idx} className={`flex group ${_isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className="flex items-end gap-2 max-w-[85%]">
                                                        {_isMe && (
                                                            <button 
                                                                onClick={() => handleDeleteMessage(msg._id)}
                                                                className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all mb-1 order-first"
                                                                title="Delete message"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <div className={`rounded-2xl p-1 ${_isMe
                                                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                                : 'bg-muted border text-foreground rounded-bl-sm shadow-sm'
                                                            }`}
                                                        >
                                                            {msg.image && (
                                                                <div 
                                                                    className="relative w-[280px] sm:w-[400px] h-48 sm:h-72 rounded-xl overflow-hidden mb-1 cursor-pointer group/img bg-black/5"
                                                                    onClick={() => setPreviewImage(msg.image)}
                                                                >
                                                                    <Image src={msg.image} alt="Chat Attachment" fill className="object-cover group-hover/img:scale-[1.05] transition-transform duration-500" />
                                                                </div>
                                                            )}
                                                        {msg.location && (
                                                            <a href={`https://www.google.com/maps/search/?api=1&query=${msg.location.lat},${msg.location.lng}`} target="_blank" rel="noopener noreferrer" className={`block mb-1 p-3 rounded-xl border transition-colors ${_isMe ? 'bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20' : 'bg-background hover:bg-muted/50 border-input'}`}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="bg-red-500/10 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                                                                        <MapPin className="h-4 w-4 text-red-500" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-semibold underline decoration-dotted">Shared Location</span>
                                                                        <span className="text-[10px] opacity-70">Tap to open in Maps</span>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        )}                                                        {msg.text && (
                                                            <p className="text-sm whitespace-pre-wrap break-words px-3 py-1.5">{msg.text}</p>
                                                        )}
                                                        <div className={`text-[10px] px-3 pb-1 flex ${_isMe ? 'justify-end' : 'justify-start'} opacity-70`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="flex flex-col bg-background">
                                    {imagePreview && (
                                        <div className="px-4 py-2 border-t flex items-center bg-muted/10 gap-3">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden border shadow-sm">
                                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                                <button type="button" onClick={() => {setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = "";}} className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black transition-colors">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex-1">Image attached</div>
                                        </div>
                                    )}
                                    <div className="p-3 border-t">
                                        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                                            <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={() => fileInputRef.current?.click()}>
                                                <ImageIcon className="h-5 w-5" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={handleShareLocation} title="Share Location">
                                                <MapPin className="h-5 w-5" />
                                            </Button>
                                            <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={handleShareDetailsClick} title="Share Contact Details">
                                                <UserIcon className="h-5 w-5" />
                                            </Button>
                                            <Input
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder={imageFile ? "Add an optional message..." : "Type a message..."}
                                                className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-1"
                                                disabled={isUploading}
                                            />
                                            <Button
                                                type="submit"
                                                size="icon"
                                                disabled={(!input.trim() && !imageFile) || isUploading}
                                                className="rounded-full h-10 w-10 shrink-0"
                                            >
                                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </main>

            {previewImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                >
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-6 right-6 text-white hover:bg-white/20 z-[110] h-12 w-12 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(null);
                        }}
                    >
                        <X className="h-8 w-8" />
                    </Button>
                    <div className="relative w-full max-w-5xl h-full py-12 flex items-center justify-center">
                        <Image 
                            src={previewImage} 
                            alt="Preview" 
                            width={1200}
                            height={900}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                title="Delete Conversation"
                description="Are you sure you want to delete this conversation? This will permanently remove all messages for both participants. This action cannot be undone."
            />

            <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader className="items-center text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-black italic">Share Details?</DialogTitle>
                        <DialogDescription className="text-muted-foreground pt-2">
                            You are going to share your personal details like <span className="font-bold text-foreground">Name, Phone number, and Email</span>.
                            <br/><br/>
                            Are you sure you want to proceed?
                        </DialogDescription>
                        <div className="flex items-center space-x-2 mt-4 pt-2 w-full justify-start border-t">
                            <input 
                                type="checkbox" 
                                id="dont-ask" 
                                checked={dontAskAgain} 
                                onChange={(e) => setDontAskAgain(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            />
                            <label htmlFor="dont-ask" className="text-xs text-muted-foreground cursor-pointer select-none">
                                Don't ask me again
                            </label>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsShareModalOpen(false)} className="w-full sm:w-auto rounded-xl">
                            Cancel
                        </Button>
                        <Button onClick={confirmShareDetails} disabled={isSharing} className="w-full sm:w-auto rounded-xl gap-2">
                            {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Share Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
