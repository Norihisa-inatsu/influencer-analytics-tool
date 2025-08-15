"use client"

import { useState, useEffect, useMemo } from "react"
import {
  LayoutDashboard,
  Search,
  Star,
  FileDown,
  Settings,
  TrendingUp,
  Target,
  Send,
  Sparkles,
  Sun,
  Moon,
  Heart,
  SlidersHorizontal,
  Plus,
  Download,
  Users,
  Link,
  DotIcon as DragHandleDots2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts"

// シートデータ定義
const sheetData = [
  { sheetName: "【TT】リーチ", media: "TikTok", format: "-", purpose: "リーチ", price: "リーチ単価" },
  { sheetName: "【TT】動画視聴", media: "TikTok", format: "-", purpose: "動画視聴", price: "視聴単価" },
  { sheetName: "【TT】トラフィック", media: "TikTok", format: "-", purpose: "トラフィック", price: "CPC" },
  { sheetName: "【IG動画】ThruPlay", media: "Instagram", format: "動画", purpose: "完全視聴", price: "完全視聴単価" },
  { sheetName: "【IG動画】リーチ", media: "Instagram", format: "動画", purpose: "リーチ", price: "リーチ単価" },
  { sheetName: "【IG動画】トラフィック", media: "Instagram", format: "動画", purpose: "トラフィック", price: "CPC" },
  { sheetName: "【IGブランドコンテンツ】リーチ", media: "Instagram", format: "ブランドコンテンツ", purpose: "リーチ", price: "リーチ単価" },
  { sheetName: "【IGブランドコンテンツ】トラフィック", media: "Instagram", format: "ブランドコンテンツ", purpose: "トラフィック", price: "CPC" },
  { sheetName: "【X第三者配信】リーチ", media: "X", format: "第三者配信", purpose: "リーチ", price: "リーチ単価" },
  { sheetName: "【X第三者配信】トラフィック", media: "X", format: "第三者配信", purpose: "トラフィック", price: "CPC" },
  { sheetName: "【X第三者配信】ENG", media: "X", format: "第三者配信", purpose: "ENG", price: "ツイートのエンゲージメント単価" },
]

// モックデータ
const performanceData = [
  {
    name: "@beauty_guru",
    cpm: 450,
    acquisitionCost: 1200,
    campaignCount: 15,
    category: "美容",
    color: "#8B5CF6",
    engagement: 8.5,
    followers: "15.2万",
  },
  {
    name: "@tech_reviewer",
    cpm: 380,
    acquisitionCost: 890,
    campaignCount: 22,
    category: "テック",
    color: "#14B8A6",
    engagement: 6.8,
    followers: "28.1万",
  },
  {
    name: "@fashion_icon",
    cpm: 520,
    acquisitionCost: 1450,
    campaignCount: 18,
    category: "ファッション",
    color: "#F59E0B",
    engagement: 9.2,
    followers: "12.3万",
  },
  {
    name: "@gaming_pro",
    cpm: 350,
    acquisitionCost: 650,
    campaignCount: 30,
    category: "ゲーム",
    color: "#EF4444",
    engagement: 9.5,
    followers: "30.5万",
  },
]

const allInfluencers = [
  {
    id: 1,
    name: "@beauty_queen_tokyo",
    realName: "田中美咲",
    followers: 123000,
    engagement: 2.5,
    category: "コスメ",
    region: "東京",
    avatar: "/placeholder.svg?height=60&width=60&text=BQ",
    price: "¥50,000-80,000",
  },
  {
    id: 2,
    name: "@skincare_expert_jp",
    realName: "佐藤ゆり",
    followers: 87000,
    engagement: 3.2,
    category: "コスメ",
    region: "大阪",
    avatar: "/placeholder.svg?height=60&width=60&text=SE",
    price: "¥30,000-60,000",
  },
  {
    id: 3,
    name: "@food_lover_osaka",
    realName: "山田太郎",
    followers: 156000,
    engagement: 4.1,
    category: "グルメ",
    region: "大阪",
    avatar: "/placeholder.svg?height=60&width=60&text=FL",
    price: "¥40,000-70,000",
  },
  {
    id: 4,
    name: "@travel_blogger_jp",
    realName: "鈴木花子",
    followers: 234000,
    engagement: 2.8,
    category: "旅行",
    region: "東京",
    avatar: "/placeholder.svg?height=60&width=60&text=TB",
    price: "¥60,000-100,000",
  },
]

const savedLists = [
  {
    id: 1,
    name: "2025年夏コスメ案件",
    influencers: [1, 2],
    totalFollowers: 210000,
    estimatedCost: "¥80,000-140,000",
  },
  {
    id: 2,
    name: "グルメ系候補",
    influencers: [3],
    totalFollowers: 156000,
    estimatedCost: "¥40,000-70,000",
  },
]

interface Message {
  id: number
  type: "user" | "ai"
  content: string
}

// カウントアップアニメーション用のコンポーネント
function CountUpNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [target])

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function UltraModernDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "こんにちは！どのようなインフルエンサーをお探しですか？",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredBubble, setHoveredBubble] = useState<any>(null)
  const [crosshairPosition, setCrosshairPosition] = useState<{ x: number; y: number } | null>(null)
  const [realData, setRealData] = useState<any[]>([]);
  const [bubbleSearchKeyword, setBubbleSearchKeyword] = useState('美容');

  // フィルター状態
  const [selectedMedia, setSelectedMedia] = useState('TikTok');
  const [selectedObjective, setSelectedObjective] = useState('リーチ');

  // 検索フィルター状態
  const [searchQuery, setSearchQuery] = useState("")
  const [followerRange, setFollowerRange] = useState([0, 500000])
  const [engagementRange, setEngagementRange] = useState([0, 10])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState("all")

  // リスト管理状態
  const [activeList, setActiveList] = useState(1)

  // 初期モックデータの設定
  useEffect(() => {
    const initialMockData = [
      {
        name: '@beauty_guru',
        cpm: 450,
        acquisitionCost: 1200,
        campaignCount: 15,
        category: '美容',
        color: '#8B5CF6',
        engagement: 8.5,
        followers: '15.2万',
      },
      {
        name: '@tech_reviewer',
        cpm: 380,
        acquisitionCost: 890,
        campaignCount: 22,
        category: 'テック',
        color: '#14B8A6',
        engagement: 6.8,
        followers: '28.1万',
      },
      {
        name: '@fashion_icon',
        cpm: 520,
        acquisitionCost: 1450,
        campaignCount: 18,
        category: 'ファッション',
        color: '#F59E0B',
        engagement: 9.2,
        followers: '12.3万',
      },
      {
        name: '@gaming_pro',
        cpm: 350,
        acquisitionCost: 650,
        campaignCount: 30,
        category: 'ゲーム',
        color: '#EF4444',
        engagement: 9.5,
        followers: '30.5万',
      }
    ];
    setRealData(initialMockData);
  }, []);

  // パフォーマンスデータ取得用のuseEffect
  useEffect(() => {
    console.log('useEffect実行 - 選択された媒体:', selectedMedia);
    console.log('useEffect実行 - 選択された目的:', selectedObjective);
    
    // 新しいAPIエンドポイント: /api/performance
    const API_ENDPOINT = '/api/performance';

    const url = new URL(API_ENDPOINT, window.location.origin);
    url.searchParams.append('media', selectedMedia);
    
    // objectiveが空でない場合のみパラメータに追加
    if (selectedObjective && selectedObjective.trim() !== '') {
      url.searchParams.append('objective', selectedObjective);
    }

    console.log('API呼び出しURL:', url.toString());

    fetch(url.toString())
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('APIから取得した生データ:', data);
        
        // データ形式を変換（実際のカラム名に合わせて修正）
        const formattedData = data.map((item: any) => {
          console.log('変換前のアイテム:', item);
          
          const formatted = {
            name: item['アカウント名'] || item['ハンドル名'],
            cpm: Number(item['CPM']) || 0, // 数値型に変換
            acquisitionCost: Number(item['単価数値']) || 0, // 数値型に変換（スペースなし）
            campaignCount: Number(item['集計元n数']) || 0, // 数値型に変換
            category: item['モデルカテゴリ'],
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            engagement: 0,
            followers: 'N/A',
          };
          
          console.log('変換後のアイテム:', formatted);
          return formatted;
        });
        
        console.log('最終的なformattedData:', formattedData);
        
        // データの検証
        const validData = formattedData.filter((item: any) => 
          typeof item.cpm === 'number' && 
          typeof item.acquisitionCost === 'number' && 
          !isNaN(item.cpm) && 
          !isNaN(item.acquisitionCost)
        );
        
        console.log('有効なデータ件数:', validData.length);
        console.log('有効なデータのサンプル:', validData.slice(0, 3));
        
        setRealData(validData);
      })
      .catch(error => {
        console.error('データの取得に失敗しました:', error);
        setRealData([]); 
      });
  }, [selectedMedia, selectedObjective]);

  // キーワード検索用のuseEffect（既存のまま）
  useEffect(() => {
    console.log('useEffect実行 - 検索キーワード:', bubbleSearchKeyword);
    
    // 空のキーワードの場合はAPIを呼び出さない
    if (!bubbleSearchKeyword || bubbleSearchKeyword.trim() === '') {
      console.log('キーワードが空のため、API呼び出しをスキップ');
      return;
    }
    
    // 新しいAPIエンドポイント: /api/influencers
    const API_ENDPOINT = '/api/influencers';

    const url = new URL(API_ENDPOINT, window.location.origin);
    url.searchParams.append('keyword', bubbleSearchKeyword);

    console.log('API呼び出しURL:', url.toString());

    fetch(url.toString())
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // データ形式を変換（実際のカラム名に合わせて修正）
        const formattedData = data.map((item: any) => ({
          name: item['アカウント名'] || item['ハンドル名'],
          cpm: Number(item['CPM']) || 0, // 数値型に変換
          acquisitionCost: Number(item['単価数値']) || 0, // 数値型に変換（スペースなし）
          campaignCount: Number(item['集計元n数']) || 0, // 数値型に変換
          category: item['モデルカテゴリ'],
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
          engagement: 0,
          followers: 'N/A',
        }));
        setRealData(formattedData);
      })
      .catch(error => {
        console.error('データの取得に失敗しました:', error);
        setRealData([]); 
      });
  }, [bubbleSearchKeyword]);

  // 目的の動的フィルタリング
  const availableObjectives = useMemo(() => {
    if (selectedMedia === 'all') {
      return Array.from(new Set(sheetData.map(item => item.purpose)));
    }
    return Array.from(new Set(
      sheetData
        .filter(item => item.media === selectedMedia)
        .map(item => item.purpose)
    ));
  }, [selectedMedia]);

  // 媒体選択時の処理
  const handleMediaChange = (media: string) => {
    setSelectedMedia(media);
    setSelectedObjective(''); // 目的をリセット
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
    }

    const aiMessage: Message = {
      id: messages.length + 2,
      type: "ai",
      content: `「${inputValue}」に関連するインフルエンサーを分析しました。推奨リストをご確認ください。`,
    }

    setMessages([...messages, userMessage, aiMessage])
    setInputValue("")
  }

  const openInfluencerModal = (influencer: any) => {
    setSelectedInfluencer(influencer)
    setIsModalOpen(true)
  }

  const CustomTooltip = ({ active, payload, coordinate }: any) => {
    if (active && payload && payload.length && coordinate) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900/95 backdrop-blur-md border border-teal-500/30 p-4 rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
          <p className="font-bold text-white text-lg mb-2">{data.name}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">カテゴリ:</span>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                {data.category}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">CPM:</span>
              <span className="text-teal-400 font-semibold">¥{data.cpm}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">獲得単価:</span>
              <span className="text-purple-400 font-semibold">¥{data.acquisitionCost}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">配信回数:</span>
              <span className="text-gray-300">{data.campaignCount}回</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">フォロワー:</span>
              <span className="text-gray-300">{data.followers}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    if (!payload) return <g />
    const size = Math.max(12, Math.min(24, payload.campaignCount * 0.8))
    const isHovered = hoveredBubble?.name === payload.name
    const isOtherHovered = hoveredBubble && hoveredBubble.name !== payload.name

    return (
      <g>
        {/* グロー効果 */}
        {isHovered && (
          <circle
            cx={cx}
            cy={cy}
            r={size + 8}
            fill={payload.color}
            fillOpacity={0.1}
            className="animate-pulse"
            style={{
              filter: `drop-shadow(0 0 20px ${payload.color}80)`,
            }}
          />
        )}
        {/* メインバブル */}
        <circle
          cx={cx}
          cy={cy}
          r={size}
          fill={payload.color}
          fillOpacity={isOtherHovered ? 0.3 : 0.8}
          className={`transition-all duration-300 ease-in-out cursor-pointer ${isHovered ? "scale-115" : "scale-100"}`}
          style={{
            filter: isHovered ? `drop-shadow(0 0 15px ${payload.color}60)` : "none",
            transform: isHovered ? "scale(1.15)" : "scale(1)",
            transformOrigin: `${cx}px ${cy}px`,
          }}
          onMouseEnter={() => {
            setHoveredBubble(payload)
            setCrosshairPosition({ x: cx, y: cy })
          }}
          onMouseLeave={() => {
            setHoveredBubble(null)
            setCrosshairPosition(null)
          }}
        />
      </g>
    )
  }

  const filteredInfluencers = allInfluencers.filter((influencer) => {
    const matchesSearch =
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.realName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFollowers = influencer.followers >= followerRange[0] && influencer.followers <= followerRange[1]
    const matchesEngagement = influencer.engagement >= engagementRange[0] && influencer.engagement <= engagementRange[1]
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(influencer.category)
    const matchesRegion = selectedRegion === "all" || influencer.region === selectedRegion

    return matchesSearch && matchesFollowers && matchesEngagement && matchesCategory && matchesRegion
  })

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* プルダウン選択 */}
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 媒体選択 */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">媒体</label>
              <Select value={selectedMedia} onValueChange={handleMediaChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="媒体を選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">すべて</SelectItem>
                  {Array.from(new Set(sheetData.map(item => item.media))).map((media) => (
                    <SelectItem key={media} value={media}>
                      {media}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 目的選択（Combobox） */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">目的</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                      !selectedObjective && "text-gray-400"
                    )}
                  >
                    {selectedObjective || "目的を選択してください"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
                  <Command className="bg-gray-800">
                    <CommandInput placeholder="目的を検索..." className="text-white" />
                    <CommandList>
                      <CommandEmpty>目的が見つかりません。</CommandEmpty>
                      <CommandGroup>
                        {availableObjectives.map((objective) => (
                          <CommandItem
                            key={objective}
                            value={objective}
                            onSelect={(currentValue) => {
                              setSelectedObjective(currentValue === selectedObjective ? "" : currentValue);
                            }}
                            className="text-white hover:bg-gray-700"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedObjective === objective ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {objective}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero KPIカード */}
      <div className="grid grid-cols-2 gap-8">
        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">平均CPM</p>
                <p className="text-4xl font-bold text-white">
                  <CountUpNumber target={413} prefix="¥" />
                </p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">平均獲得単価</p>
                <p className="text-4xl font-bold text-white">
                  <CountUpNumber target={981} prefix="¥" />
                </p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"></div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ 2カラム */}
      <div className="grid grid-cols-3 gap-8">
        {/* パフォーマンス可視化 */}
        <div className="col-span-2">
          <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 h-full">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                パフォーマンス可視化
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    {/* 十字ガイド線 */}
                    {crosshairPosition && (
                      <>
                        <ReferenceLine
                          x={hoveredBubble?.cpm}
                          stroke="#14B8A6"
                          strokeDasharray="5 5"
                          strokeOpacity={0.6}
                        />
                        <ReferenceLine
                          y={hoveredBubble?.acquisitionCost}
                          stroke="#14B8A6"
                          strokeDasharray="5 5"
                          strokeOpacity={0.6}
                        />
                      </>
                    )}
                    <XAxis
                      type="number"
                      dataKey="cpm"
                      name="CPM実績"
                      tickFormatter={(value) => `¥${value}`}
                      label={{ value: "CPM単価 (円)", position: "insideBottom", offset: -10 }}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="acquisitionCost"
                      name="獲得単価"
                      tickFormatter={(value) => `¥${value}`}
                      label={{ value: "獲得単価 (円)", angle: -90, position: "insideLeft" }}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {realData.length > 0 ? (
                      <>
                        <Scatter data={realData} shape={CustomDot} />
                        <text x="50%" y="90%" textAnchor="middle" fill="#10B981" fontSize="12">
                          データ取得成功: {realData.length}件
                        </text>
                      </>
                    ) : (
                      <text x="50%" y="50%" textAnchor="middle" fill="#9CA3AF" fontSize="14">
                        データを選択してください (realData: {realData.length}件)
                      </text>
                    )}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AIインフルエンサー検索 */}
        <div className="space-y-6">
          {/* チャットインターフェース */}
          <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-400" />
                AI検索
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start gap-2 max-w-[85%]">
                      {message.type === "ai" && (
                        <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl text-sm transition-all duration-300 ${
                          message.type === "user"
                            ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                            : "bg-gray-800 text-gray-200 border border-gray-700"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="インフルエンサーを検索..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-teal-500"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 推奨インフルエンサー */}
          <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-white">推奨インフルエンサー</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allInfluencers.slice(0, 3).map((influencer) => (
                <Card
                  key={influencer.id}
                  className="bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group"
                  onClick={() => openInfluencerModal(influencer)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all">
                          <AvatarImage src={influencer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{influencer.name.slice(1, 3).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {influencer.name}
                        </h4>
                        <p className="text-xs text-gray-400 mb-1">{influencer.category}</p>
                        <p className="text-xs text-gray-500">
                          {(influencer.followers / 1000).toFixed(1)}K | ENG: {influencer.engagement}%
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        詳細
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderSearch = () => (
    <div className="space-y-6">
      {/* 検索バー */}
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="インフルエンサー名で検索..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-teal-500"
              />
            </div>
            <Button className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              詳細フィルター
            </Button>
          </div>

          {/* フィルター */}
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">フォロワー数</label>
              <Slider
                value={followerRange}
                onValueChange={setFollowerRange}
                max={500000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{(followerRange[0] / 1000).toFixed(0)}K</span>
                <span>{(followerRange[1] / 1000).toFixed(0)}K</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">エンゲージメント率</label>
              <Slider
                value={engagementRange}
                onValueChange={setEngagementRange}
                max={10}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{engagementRange[0]}%</span>
                <span>{engagementRange[1]}%</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">カテゴリ</label>
              <div className="space-y-2">
                {["コスメ", "グルメ", "旅行", "ファッション"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category])
                        } else {
                          setSelectedCategories(selectedCategories.filter((c) => c !== category))
                        }
                      }}
                    />
                    <label htmlFor={category} className="text-sm text-gray-300">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">地域</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全地域</SelectItem>
                  <SelectItem value="東京">東京</SelectItem>
                  <SelectItem value="大阪">大阪</SelectItem>
                  <SelectItem value="名古屋">名古屋</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 検索結果 */}
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">検索結果 ({filteredInfluencers.length}件)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInfluencers.map((influencer) => (
              <Card
                key={influencer.id}
                className="bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={influencer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{influencer.name.slice(1, 3).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{influencer.name}</h4>
                      <p className="text-sm text-gray-400">{influencer.realName}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">フォロワー:</span>
                      <span className="text-white">{(influencer.followers / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">エンゲージメント:</span>
                      <span className="text-white">{influencer.engagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">地域:</span>
                      <span className="text-white">{influencer.region}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600">
                      <Plus className="h-3 w-3 mr-1" />
                      リストに追加
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      詳細
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLists = () => (
    <div className="grid grid-cols-4 gap-6 h-full">
      {/* 左カラム: リスト一覧 */}
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            保存済みリスト
            <Button size="sm" className="bg-gradient-to-br from-purple-500 to-purple-600">
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {savedLists.map((list) => (
            <Card
              key={list.id}
              className={`cursor-pointer transition-all duration-300 ${
                activeList === list.id
                  ? "bg-purple-500/20 border-purple-500/50"
                  : "bg-gray-800/50 border-gray-700 hover:border-purple-500/30"
              }`}
              onClick={() => setActiveList(list.id)}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-2">{list.name}</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>{list.influencers.length}名のインフルエンサー</p>
                  <p>総フォロワー: {(list.totalFollowers / 1000).toFixed(1)}K</p>
                  <p>予算: {list.estimatedCost}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* 右カラム: 選択されたリストの詳細 */}
      <div className="col-span-3">
        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 h-full">
          <CardHeader>
            <CardTitle className="text-white">{savedLists.find((list) => list.id === activeList)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedLists
                .find((list) => list.id === activeList)
                ?.influencers.map((influencerId) => {
                  const influencer = allInfluencers.find((inf) => inf.id === influencerId)
                  if (!influencer) return null
                  return (
                    <Card key={influencer.id} className="bg-gray-800/50 border border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <DragHandleDots2 className="h-5 w-5 text-gray-500 cursor-move" />
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={influencer.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{influencer.name.slice(1, 3).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{influencer.name}</h4>
                            <p className="text-sm text-gray-400">{influencer.realName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">フォロワー</p>
                            <p className="text-white font-semibold">{(influencer.followers / 1000).toFixed(1)}K</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">エンゲージメント</p>
                            <p className="text-white font-semibold">{influencer.engagement}%</p>
                          </div>
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                            詳細
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <FileDown className="h-6 w-6" />
            レポート生成
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">レポートタイプ</label>
              <Select defaultValue="dashboard">
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="dashboard">ダッシュボードサマリー</SelectItem>
                  <SelectItem value="influencer-list">インフルエンサーリスト</SelectItem>
                  <SelectItem value="performance">パフォーマンス分析</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">期間</label>
              <Select defaultValue="30days">
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="7days">過去7日</SelectItem>
                  <SelectItem value="30days">過去30日</SelectItem>
                  <SelectItem value="90days">過去90日</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <Download className="h-4 w-4 mr-2" />
              PDFでエクスポート
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              CSVでダウンロード
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* プレビューエリア */}
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">レポートプレビュー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <FileDown className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">レポートのプレビューがここに表示されます</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettings = () => (
    <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Settings className="h-6 w-6" />
          設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
              プロフィール
            </TabsTrigger>
            <TabsTrigger value="accounts" className="data-[state=active]:bg-purple-600">
              連携アカウント
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600">
              通知設定
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-600">
              セキュリティ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">ユーザー名</label>
                <Input defaultValue="田中太郎" className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">メールアドレス</label>
                <Input defaultValue="tanaka@example.com" className="bg-gray-800 border-gray-700 text-white" />
              </div>
            </div>
            <Button className="bg-gradient-to-br from-purple-500 to-purple-600">変更を保存</Button>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Card className="bg-gray-800/50 border border-gray-700">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Link className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Google</h4>
                      <p className="text-sm text-gray-400">連携済み</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                    解除
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">メール通知</h4>
                  <p className="text-sm text-gray-400">新しいレポートが生成された時</p>
                </div>
                <Checkbox defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">プッシュ通知</h4>
                  <p className="text-sm text-gray-400">重要な更新について</p>
                </div>
                <Checkbox />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">現在のパスワード</label>
                <Input type="password" className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">新しいパスワード</label>
                <Input type="password" className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <Button className="bg-gradient-to-br from-purple-500 to-purple-600">パスワードを変更</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return renderDashboard()
      case "search":
        return renderSearch()
      case "lists":
        return renderLists()
      case "reports":
        return renderReports()
      case "settings":
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* 固定アイコンサイドバー */}
      <div className="w-20 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-6 fixed h-full z-10">
        {/* ロゴ */}
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl flex items-center justify-center mb-8">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>

        {/* ナビゲーション */}
        <nav className="space-y-4">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "ダッシュボード" },
            { id: "search", icon: Search, label: "インフルエンサー検索" },
            { id: "lists", icon: Star, label: "リスト管理" },
            { id: "reports", icon: FileDown, label: "レポート" },
            { id: "settings", icon: Settings, label: "設定" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              title={label}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                activeNav === id
                  ? "bg-gradient-to-br from-purple-500 to-teal-500 shadow-lg shadow-purple-500/25"
                  : "hover:bg-gray-800 hover:shadow-lg hover:shadow-teal-500/20"
              }`}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </nav>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 ml-20">
        {/* ヘッダー */}
        <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 px-8 py-6 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              CASFEED
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
                <AvatarImage src="/placeholder.svg?height=40&width=40&text=U" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-8">{renderContent()}</div>
      </div>

      {/* インフルエンサー詳細モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 max-w-2xl animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedInfluencer?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{selectedInfluencer?.name?.slice(1, 3).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white">{selectedInfluencer?.realName}</p>
                <p className="text-sm text-gray-400">{selectedInfluencer?.name}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedInfluencer && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">フォロワー</p>
                    <p className="text-lg font-bold text-white">{(selectedInfluencer.followers / 1000).toFixed(1)}K</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-6 w-6 text-teal-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">エンゲージメント</p>
                    <p className="text-lg font-bold text-white">{selectedInfluencer.engagement}%</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">料金</p>
                    <p className="text-lg font-bold text-white">{selectedInfluencer.price}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                  コンタクト
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  詳細レポート
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
