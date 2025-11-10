"use client"

import { useState, useEffect, useMemo, useRef } from "react"
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
  Heart,
  SlidersHorizontal,
  Plus,
  Download,
  Users,
  Link,
  GripVertical as DragHandleDots2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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



// 改善された保存済みリストデータ構造
const savedLists = [
  {
    id: 1,
    name: "2025年夏コスメ案件",
    description: "夏のコスメキャンペーン用のインフルエンサーリスト",
    category: "コスメ",
    budget: {
      min: 80000,
      max: 140000,
      currency: "JPY"
    },
    influencers: [1, 2],
    totalFollowers: 210000,
    estimatedCost: "¥80,000-140,000",
    tags: ["夏", "コスメ", "2025"],
    status: "active",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: 2,
    name: "グルメ系候補",
    description: "グルメ系インフルエンサーの候補リスト",
    category: "グルメ",
    budget: {
      min: 40000,
      max: 70000,
      currency: "JPY"
    },
    influencers: [3],
    totalFollowers: 156000,
    estimatedCost: "¥40,000-70,000",
    tags: ["グルメ", "大阪"],
    status: "draft",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content:
        "以下のような検索ができます。\n\n" +
        "• Xのヘアケア商材でエンゲージメント単価が安いインフルエンサー\n" +
        "• TikTokのスキンケアでリーチ単価が安いインフルエンサー\n" +
        "• Instagramで家電ジャンルのCPMが低いインフルエンサー\n" +
        "• 予算10万円で効果の高い候補を提案して",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredBubble, setHoveredBubble] = useState<any>(null)
  const [crosshairPosition, setCrosshairPosition] = useState<{ x: number; y: number } | null>(null)
  const [realData, setRealData] = useState<any[]>([]);
  const [bubbleSearchKeyword, setBubbleSearchKeyword] = useState('美容');

  // フィルター状態（ダッシュボード用）
  const [dashboardMedia, setDashboardMedia] = useState('TikTok');
  const [dashboardObjective, setDashboardObjective] = useState('リーチ');

  // 検索フィルター状態
  const [selectedMedia, setSelectedMedia] = useState("TikTok")
  const [selectedObjective, setSelectedObjective] = useState("all")
  const [selectedModelCategory, setSelectedModelCategory] = useState("all")
  const [selectedProductGenre, setSelectedProductGenre] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // 並び替え機能の状態
  const [sortField, setSortField] = useState('CPM')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // ソートフィールドとキーのマッピング
  const sortFieldKeys: Record<string, string[]> = {
    'CPM': ['cpm', 'CPM'],
    'リーチ単価': ['reach_cost', '単価数値'],
    'FQ': ['fq', 'FQ'],
    'CTR': ['ctr', 'CTR', 'car'],
    'CPC': ['cpc', 'CPC'],
    '単価数値': ['単価数値', 'reach_cost'],
    'アカウント名': ['account_name', 'アカウント名'],
    'ハンドル名': ['handle_name', 'ハンドル名'],
    'モデルカテゴリ': ['model_category', 'モデルカテゴリ'],
    '商品': ['product', '商品']
  }

  // 並び替え関数
  const sortResults = (results: any[]) => {
    if (!results || results.length === 0) return results;
    
    return [...results].sort((a, b) => {
      // ソートフィールドに対応するキー配列を取得
      const keys = sortFieldKeys[sortField] || [sortField];
      
      // 数値フィールドの場合はpickNumberByKeysを使用
      const isNumericField = ['CPM', 'リーチ単価', 'FQ', 'CTR', 'CPC', '単価数値'].includes(sortField);
      
      let aValue: any;
      let bValue: any;
      
      if (isNumericField) {
        // 数値フィールドの場合
        aValue = pickNumberByKeys(a, keys) ?? 0;
        bValue = pickNumberByKeys(b, keys) ?? 0;
      } else {
        // テキストフィールドの場合
        aValue = keys.reduce((val: any, key: string) => val ?? a[key], undefined);
        bValue = keys.reduce((val: any, key: string) => val ?? b[key], undefined);
        
        // 文字列の場合は小文字に変換して比較
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
        }
        if (typeof bValue === 'string') {
          bValue = bValue.toLowerCase();
        }
        
        // null/undefinedの場合は空文字として扱う
        aValue = aValue ?? '';
        bValue = bValue ?? '';
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  // 並び替えフィールド変更時の処理
  const handleSortFieldChange = (field: string) => {
    if (sortField === field) {
      // 同じフィールドの場合は方向を反転
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 新しいフィールドの場合は降順で開始
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 連動フィルタリング用の選択肢
  const [availableSearchObjectives, setAvailableSearchObjectives] = useState<string[]>([])
  const [availableModelCategories, setAvailableModelCategories] = useState<string[]>([])
  const [availableProductGenres, setAvailableProductGenres] = useState<string[]>([])
  const [availableProducts, setAvailableProducts] = useState<string[]>([])

  // 連動フィルタリング用の関数
  const updateAvailableOptions = async (field: string, filters: any) => {
    try {
      // 日本語フィールド名 → API用カラム名
      const fieldMap: Record<string, string> = {
        '目的': 'objective',
        'モデルカテゴリ': 'model_category',
        '商材ジャンル': 'product_genre',
        '商品': 'product',
      };
      const apiField = fieldMap[field] || field;

      const url = new URL('/api/influencer/schema', window.location.origin);
      url.searchParams.append('field', apiField);
      
      // フィルターを適用（空のオブジェクトの場合は全データを取得）
      if (Object.keys(filters).length > 0) {
        if (filters.media && filters.media !== 'all') {
          url.searchParams.append('media', filters.media);
        }
        if (filters.objective && filters.objective !== 'all') {
          url.searchParams.append('objective', filters.objective);
        }
        if (filters.modelCategory && filters.modelCategory !== 'all') {
          url.searchParams.append('modelCategory', filters.modelCategory);
        }
        if (filters.productGenre && filters.productGenre !== 'all') {
          url.searchParams.append('productGenre', filters.productGenre);
        }
      }

      console.log(`選択肢更新 - フィールド: ${field}, フィルター:`, filters);
      const response = await fetch(url.toString());
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(`選択肢更新成功 - フィールド: ${field}, 件数: ${result.count}`);
          switch (field) {
            case '目的':
              setAvailableSearchObjectives(result.data);
              break;
            case 'モデルカテゴリ':
              setAvailableModelCategories(result.data);
              break;
            case '商材ジャンル':
              setAvailableProductGenres(result.data);
              break;
            case '商品':
              setAvailableProducts(result.data);
              break;
          }
        }
      }
    } catch (error) {
      console.error('選択肢の更新に失敗:', error);
    }
  };

  // 媒体選択時の処理
  const handleMediaChange = (media: string) => {
    console.log('媒体選択:', media);
    setSelectedMedia(media);
    setSelectedObjective('all');
    setSelectedModelCategory('all');
    setSelectedProductGenre('all');
    setSelectedProduct('all');
    
    // 目的の選択肢を更新
    updateAvailableOptions('目的', { media });
  };

  // 目的選択時の処理
  const handleObjectiveChange = (objective: string) => {
    console.log('目的選択:', objective, '媒体:', selectedMedia);
    setSelectedObjective(objective);
    setSelectedProductGenre('all');
    setSelectedProduct('all');
    setSelectedModelCategory('all');
    
    // 商材ジャンルの選択肢を更新
    updateAvailableOptions('商材ジャンル', { 
      media: selectedMedia, 
      objective 
    });
  };

  // モデルカテゴリ選択時の処理（最後の項目なので何も更新しない）
  const handleModelCategoryChange = (modelCategory: string) => {
    setSelectedModelCategory(modelCategory);
  };

  // 商材ジャンル選択時の処理
  const handleProductGenreChange = (productGenre: string) => {
    setSelectedProductGenre(productGenre);
    setSelectedProduct('all');
    
    // 商品の選択肢を更新
    updateAvailableOptions('商品', { 
      media: selectedMedia, 
      objective: selectedObjective, 
      productGenre 
    });
  };

  // 商品選択時の処理
  const handleProductChange = (product: string) => {
    setSelectedProduct(product);
    
    // モデルカテゴリの選択肢を更新
    updateAvailableOptions('モデルカテゴリ', { 
      media: selectedMedia, 
      objective: selectedObjective, 
      productGenre: selectedProductGenre,
      product
    });
  };

  // 検索実行関数
  const executeSearch = async () => {
    setIsSearching(true);
    try {
      const url = new URL('/api/search', window.location.origin);
      
      // 検索パラメータを設定（all は送らない）
      const keywordParts: string[] = [];
      if (selectedProductGenre !== 'all') keywordParts.push(selectedProductGenre);
      if (selectedProduct !== 'all') keywordParts.push(selectedProduct);
      if (selectedModelCategory !== 'all') keywordParts.push(selectedModelCategory);

      if (keywordParts.length > 0) {
        url.searchParams.append('searchQuery', keywordParts.join(' '));
      }

      if (selectedModelCategory !== 'all') {
        url.searchParams.append('selectedCategories', selectedModelCategory);
      }
      
      if (selectedMedia !== 'all') {
        url.searchParams.append('selectedMedia', selectedMedia);
      }
      
      if (selectedObjective !== 'all') {
        url.searchParams.append('selectedObjective', selectedObjective);
      }

      // 期間フィルター
      if (startDate) {
        url.searchParams.append('startDate', startDate);
      }
      if (endDate) {
        url.searchParams.append('endDate', endDate);
      }
      
      console.log('検索API呼び出し:', url.toString());
      console.log('検索条件:', {
        media: selectedMedia,
        objective: selectedObjective,
        modelCategory: selectedModelCategory,
        productGenre: selectedProductGenre,
        product: selectedProduct,
        startDate: startDate,
        endDate: endDate
      });
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`検索APIエラー: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('検索結果:', result);
      console.log('取得件数:', result.data?.length || 0);
      if (result?.data && result.data.length > 0) {
        try {
          console.log('検索結果 先頭要素のキー:', Object.keys(result.data[0]));
          const sample = result.data[0];
          console.log('サンプル値: account_name=', sample.account_name, 'handle_name=', sample.handle_name, 'cpm=', sample.cpm, 'reach_cost=', sample.reach_cost, 'fq=', sample.fq, 'ctr/car=', sample.ctr ?? sample.car, 'cpc=', sample.cpc);
        } catch (e) {}
      }
      
      if (result.success) {
        setSearchResults(result.data);
      } else {
        console.error('検索失敗:', result.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('検索実行エラー:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 検索条件クリア関数
  const clearSearchFilters = () => {
    setSelectedMedia("TikTok");
    setSelectedObjective("all");
    setSelectedModelCategory("all");
    setSelectedProductGenre("all");
    setSelectedProduct("all");
    setStartDate(null);
    setEndDate(null);
    setSearchResults([]);
  };

  // ===== 媒体別サマリー用ヘルパー =====
  type MetricType = 'currency' | 'percent' | 'number'
  type MetricDef = { label: string; keys: string[]; type: MetricType }

  // 値を数値に変換（無効値は undefined）
  const toNumber = (value: unknown): number | undefined => {
    if (value === null || value === undefined) return undefined
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : undefined
  }

  // 指定キーのどれかから数値を取得
  const pickNumberByKeys = (row: any, keys: string[]): number | undefined => {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const n = toNumber(row[key])
        if (n !== undefined) return n
      }
    }
    return undefined
  }

  // 統計量を計算
  const computeStats = (values: number[]) => {
    if (!values || values.length === 0) return null
    const sorted = [...values].sort((a, b) => a - b)
    const sum = sorted.reduce((s, v) => s + v, 0)
    const avg = sum / sorted.length
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const mid = Math.floor(sorted.length / 2)
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
    return { avg, max, min, median, count: sorted.length }
  }

  // 表示フォーマット
  const formatValue = (value: number | null | undefined, type: MetricType): string => {
    if (value === null || value === undefined || !Number.isFinite(value)) return '—'
    switch (type) {
      case 'currency':
        return `¥${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case 'percent':
        return `${(value * 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
      default:
        return `${value.toLocaleString(undefined, { maximumFractionDigits: 3 })}`
    }
  }

  // 媒体別メトリクス定義（RAWビュー/既存casfeed両対応のキー候補を列挙）
  const metricsByMedia: Record<string, MetricDef[]> = {
    TikTok: [
      { label: 'リーチ単価', type: 'currency', keys: ['reach_cost', '単価数値'] },
      { label: 'CPM', type: 'currency', keys: ['cpm', 'CPM'] },
      { label: 'FQ', type: 'number', keys: ['fq', 'FQ'] },
      { label: 'CTR', type: 'percent', keys: ['ctr', 'CTR'] },
      { label: 'CPC', type: 'currency', keys: ['cpc', 'CPC'] },
      { label: '視聴率', type: 'percent', keys: ['view_rate'] },
      { label: '視聴単価', type: 'currency', keys: ['cpv'] },
      { label: '2秒視聴率', type: 'percent', keys: ['view_rate_2s'] },
      { label: '2秒視聴単価', type: 'currency', keys: ['cpv_2s'] },
      { label: '6秒視聴率', type: 'percent', keys: ['view_rate_6s'] },
      { label: '6秒視聴単価', type: 'currency', keys: ['cpv_6s'] },
      { label: '完全視聴率', type: 'percent', keys: ['completion_rate'] },
      { label: '完全視聴単価', type: 'currency', keys: ['cpvc'] }
    ],
    Instagram: [
      { label: 'リーチ単価', type: 'currency', keys: ['reach_cost', '単価数値'] },
      { label: 'CPM', type: 'currency', keys: ['cpm', 'CPM'] },
      { label: 'FQ', type: 'number', keys: ['fq', 'FQ'] },
      { label: 'CTR', type: 'percent', keys: ['ctr', 'CTR'] },
      { label: 'CPC', type: 'currency', keys: ['cpc', 'CPC'] },
      { label: '視聴率', type: 'percent', keys: ['view_rate'] },
      { label: '視聴単価', type: 'currency', keys: ['cpv'] },
      { label: '25％視聴率', type: 'percent', keys: ['view_rate_25p'] },
      { label: '25％視聴単価', type: 'currency', keys: ['cpv_25p'] },
      { label: '完全視聴率', type: 'percent', keys: ['completion_rate'] },
      { label: '完全視聴単価', type: 'currency', keys: ['cpvc'] }
    ],
    X: [
      { label: 'リーチ単価', type: 'currency', keys: ['reach_cost', '単価数値'] },
      { label: 'CPM', type: 'currency', keys: ['cpm', 'CPM'] },
      { label: 'FQ', type: 'number', keys: ['fq', 'FQ'] },
      { label: 'CTR', type: 'percent', keys: ['ctr', 'CTR'] },
      { label: 'CPC', type: 'currency', keys: ['cpc', 'CPC'] },
      { label: 'ENG率', type: 'percent', keys: ['engagement_rate'] },
      { label: 'CPE', type: 'currency', keys: ['cpe'] }
    ]
  }

  // リスト管理状態
  const [activeList, setActiveList] = useState(1)
  
  // リスト作成・編集モーダル状態
  const [isListModalOpen, setIsListModalOpen] = useState(false)
  const [editingList, setEditingList] = useState<any>(null)
  const [listFormData, setListFormData] = useState({
    name: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    tags: "",
    status: "draft"
  })
  
  // リスト検索・フィルタリング状態
  const [listSearchQuery, setListSearchQuery] = useState("")
  const [listCategoryFilter, setListCategoryFilter] = useState("all")
  const [listStatusFilter, setListStatusFilter] = useState("all")
  
  // インフルエンサー追加モーダル状態
  const [isAddInfluencerModalOpen, setIsAddInfluencerModalOpen] = useState(false)
  const [addInfluencerSearchQuery, setAddInfluencerSearchQuery] = useState("")
  const [addInfluencerCategoryFilter, setAddInfluencerCategoryFilter] = useState("all")

  // ツールチップの表示制御用
  const hideTooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  // リスト管理のヘルパー関数
  const openListModal = (list?: any) => {
    if (list) {
      setEditingList(list)
      setListFormData({
        name: list.name,
        description: list.description || "",
        category: list.category || "",
        budgetMin: list.budget?.min?.toString() || "",
        budgetMax: list.budget?.max?.toString() || "",
        tags: list.tags?.join(", ") || "",
        status: list.status || "draft"
      })
    } else {
      setEditingList(null)
      setListFormData({
        name: "",
        description: "",
        category: "",
        budgetMin: "",
        budgetMax: "",
        tags: "",
        status: "draft"
      })
    }
    setIsListModalOpen(true)
  }

  const handleListSubmit = () => {
    if (!listFormData.name.trim()) return

    const newList = {
      id: editingList?.id || Date.now(),
      name: listFormData.name,
      description: listFormData.description,
      category: listFormData.category,
      budget: {
        min: parseInt(listFormData.budgetMin) || 0,
        max: parseInt(listFormData.budgetMax) || 0,
        currency: "JPY"
      },
      influencers: editingList?.influencers || [],
      totalFollowers: editingList?.totalFollowers || 0,
      estimatedCost: `¥${listFormData.budgetMin || 0}-${listFormData.budgetMax || 0}`,
      tags: listFormData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      status: listFormData.status,
      createdAt: editingList?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (editingList) {
      // 既存リストの更新
      const updatedLists = savedLists.map(list => 
        list.id === editingList.id ? newList : list
      )
      // 実際のアプリケーションでは、ここでAPIを呼び出してデータベースを更新
      console.log("リスト更新:", newList)
    } else {
      // 新規リストの作成
      // 実際のアプリケーションでは、ここでAPIを呼び出してデータベースに保存
      console.log("新規リスト作成:", newList)
    }

    setIsListModalOpen(false)
    setEditingList(null)
    setListFormData({
      name: "",
      description: "",
      category: "",
      budgetMin: "",
      budgetMax: "",
      tags: "",
      status: "draft"
    })
  }

  const deleteList = (listId: number) => {
    if (confirm("このリストを削除してもよろしいですか？")) {
      // 実際のアプリケーションでは、ここでAPIを呼び出してデータベースから削除
      console.log("リスト削除:", listId)
      if (activeList === listId) {
        setActiveList(savedLists[0]?.id || 1)
      }
    }
  }

  const addInfluencerToList = (listId: number, influencerId: number) => {
    // 実際のアプリケーションでは、ここでAPIを呼び出してデータベースを更新
    console.log("インフルエンサー追加:", { listId, influencerId })
  }

  const removeInfluencerFromList = (listId: number, influencerId: number) => {
    // 実際のアプリケーションでは、ここでAPIを呼び出してデータベースを更新
    console.log("インフルエンサー削除:", { listId, influencerId })
  }

  // フィルタリングされたリストを取得
  const filteredLists = savedLists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(listSearchQuery.toLowerCase()) ||
                         list.description?.toLowerCase().includes(listSearchQuery.toLowerCase())
    const matchesCategory = listCategoryFilter === "all" || list.category === listCategoryFilter
    const matchesStatus = listStatusFilter === "all" || list.status === listStatusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // 媒体選択に応じて目的の選択肢を取得（新APIは媒体指定が必須のためガード）
  useEffect(() => {
    if (selectedMedia && selectedMedia !== 'all') {
      updateAvailableOptions('目的', { media: selectedMedia });
    }
  }, [selectedMedia]);

  // パフォーマンスデータ取得用のuseEffect
  useEffect(() => {
    console.log('=== useEffect実行 - パフォーマンスデータ取得 ===');
    console.log('選択された媒体:', dashboardMedia);
    console.log('選択された目的:', dashboardObjective);
    console.log('objectiveが空かどうか:', !dashboardObjective || dashboardObjective.trim() === '');
    
    // 新しいAPIエンドポイント: /api/performance
    const API_ENDPOINT = '/api/performance';

    const url = new URL(API_ENDPOINT, window.location.origin);
    url.searchParams.append('media', dashboardMedia);
    
    // objectiveが空でない場合のみパラメータに追加
    if (dashboardObjective && dashboardObjective.trim() !== '') {
      url.searchParams.append('objective', dashboardObjective);
      console.log('objectiveパラメータを追加:', dashboardObjective);
    } else {
      console.log('objectiveパラメータは追加しない（空のため）');
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
        try {
          console.log('APIから取得した生データ:', data);
          
          // データが配列でない場合は空配列を設定
          if (!Array.isArray(data)) {
            console.error('APIから取得したデータが配列ではありません:', data);
            setRealData([]);
            return;
          }
          
          // データ形式を変換（実際のカラム名に合わせて修正）
          const formattedData = data.map((item: any) => {
            try {
              console.log('変換前のアイテム:', item);
              
              const formatted = {
                name: item['アカウント名'] || item['ハンドル名'] || 'Unknown',
                cpm: Number(item['CPM']) || 0, // 数値型に変換
                acquisitionCost: Number(item['単価数値']) || 0, // 数値型に変換（スペースなし）
                campaignCount: Number(item['集計元n数']) || 0, // 数値型に変換
                category: item['モデルカテゴリ'] || 'Unknown',
                media: item['媒体'] || selectedMedia, // データベースの媒体情報を使用
                objective: item['目的'] || '', // 目的プロパティを追加
                color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                engagement: 0,
                followers: 'N/A',
              };
              
              console.log('変換後のアイテム:', formatted);
              return formatted;
            } catch (itemError) {
              console.error('アイテム変換エラー:', itemError, item);
              return null;
            }
          }).filter(Boolean); // nullを除外
        
        console.log('=== データ変換完了 ===');
        console.log('変換前のデータ件数:', data.length);
        console.log('最終的なformattedData件数:', formattedData.length);
        
        // データの検証
        const validData = formattedData.filter((item: any) => 
          typeof item.cpm === 'number' && 
          typeof item.acquisitionCost === 'number' && 
          !isNaN(item.cpm) && 
          !isNaN(item.acquisitionCost)
        );
        
        console.log('=== データ検証結果 ===');
        console.log('有効なデータ件数:', validData.length);
        console.log('無効なデータ件数:', formattedData.length - validData.length);
        
        if (validData.length > 0) {
          console.log('有効なデータのサンプル（最初の3件）:');
          validData.slice(0, 3).forEach((item: any, index: number) => {
            console.log(`  ${index + 1}件目:`, {
              name: item.name,
              cpm: item.cpm,
              acquisitionCost: item.acquisitionCost,
              campaignCount: item.campaignCount,
              category: item.category
            });
          });
        }
        
        if (formattedData.length - validData.length > 0) {
          console.log('無効なデータのサンプル（最初の3件）:');
          formattedData.filter((item: any) => 
            typeof item.cpm !== 'number' || 
            typeof item.acquisitionCost !== 'number' || 
            isNaN(item.cpm) || 
            isNaN(item.acquisitionCost)
          ).slice(0, 3).forEach((item: any, index: number) => {
            console.log(`  ${index + 1}件目:`, {
              name: item.name,
              cpm: item.cpm,
              acquisitionCost: item.acquisitionCost,
              campaignCount: item.campaignCount,
              category: item.category
            });
          });
        }
        
        console.log('=== realDataに設定 ===');
        setRealData(validData);
        } catch (processingError) {
          console.error('データ処理エラー:', processingError);
          setRealData([]);
        }
      })
      .catch(error => {
        console.error('データの取得に失敗しました:', error);
        setRealData([]); 
      });
  }, [dashboardMedia, dashboardObjective]);

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
          media: 'all', // キーワード検索の場合は媒体を'all'に設定
          objective: item['目的'] || '', // 目的プロパティを追加
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
    if (dashboardMedia === 'all') {
      return Array.from(new Set(sheetData.map(item => item.purpose)));
    }
    return Array.from(new Set(
      sheetData
        .filter(item => item.media === dashboardMedia)
        .map(item => item.purpose)
    ));
  }, [dashboardMedia]);

  // 目的に応じた単価名を取得する関数
  const getPriceLabel = (objective: string) => {
    const priceMap: { [key: string]: string } = {
      'リーチ': 'リーチ単価',
      '動画視聴': '視聴単価',
      'トラフィック': 'CPC',
      '完全視聴': '完全視聴単価',
      'ENG': 'エンゲージメント単価'
    };
    return priceMap[objective] || '獲得単価';
  };

  // フィルタリングされたデータから詳細統計を計算
  const calculateFilteredStatistics = () => {
    console.log('calculateFilteredStatistics実行:', {
      realDataLength: realData?.length,
      dashboardMedia,
      dashboardObjective,
      realDataSample: realData?.slice(0, 2)
    });
    
    if (!realData || realData.length === 0) {
      console.log('realDataが空のため、デフォルト値を返す');
      return {
        cpm: { avg: 0, max: 0, min: 0, median: 0, count: 0 },
        acquisitionCost: { avg: 0, max: 0, min: 0, median: 0, count: 0 }
      };
    }
    
    const filteredData = realData.filter(item => {
      const matchesMedia = dashboardMedia === 'all' || item.media === dashboardMedia;
      const matchesObjective = !dashboardObjective || dashboardObjective === '' || item.objective === dashboardObjective;
      
      console.log('フィルタリング:', {
        itemMedia: item.media,
        itemObjective: item.objective,
        matchesMedia,
        matchesObjective,
        result: matchesMedia && matchesObjective
      });
      
      return matchesMedia && matchesObjective;
    });
    
    console.log('フィルタリング結果:', {
      totalData: realData.length,
      filteredData: filteredData.length,
      filteredSample: filteredData.slice(0, 2)
    });
    
    if (filteredData.length === 0) {
      console.log('フィルタリング後のデータが0件のため、デフォルト値を返す');
      return {
        cpm: { avg: 0, max: 0, min: 0, median: 0, count: 0 },
        acquisitionCost: { avg: 0, max: 0, min: 0, median: 0, count: 0 }
      };
    }
    
    // CPMの統計計算
    const cpmValues = filteredData.map(item => item.cpm || 0).filter(val => val > 0).sort((a, b) => a - b);
    const cpmStats = calculateStats(cpmValues);
    
    // 獲得単価の統計計算
    const acquisitionCostValues = filteredData.map(item => item.acquisitionCost || 0).filter(val => val > 0).sort((a, b) => a - b);
    const acquisitionCostStats = calculateStats(acquisitionCostValues);
    
    const result = {
      cpm: {
        avg: Number(cpmStats.avg.toFixed(3)),
        max: Number(cpmStats.max.toFixed(3)),
        min: Number(cpmStats.min.toFixed(3)),
        median: Number(cpmStats.median.toFixed(3)),
        count: cpmStats.count
      },
      acquisitionCost: {
        avg: Number(acquisitionCostStats.avg.toFixed(3)),
        max: Number(acquisitionCostStats.max.toFixed(3)),
        min: Number(acquisitionCostStats.min.toFixed(3)),
        median: Number(acquisitionCostStats.median.toFixed(3)),
        count: acquisitionCostStats.count
      }
    };
    
    console.log('統計計算結果:', result);
    return result;
  };

  // 統計計算のヘルパー関数
  const calculateStats = (values: number[]) => {
    if (values.length === 0) {
      return { avg: 0, max: 0, min: 0, median: 0, count: 0 };
    }
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const median = values.length % 2 === 0 
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];
    const count = values.length;
    
    return { avg, max, min, median, count };
  };

  // 現在選択されている目的の単価名を取得
  const currentPriceLabel = getPriceLabel(dashboardObjective);

  // SNSアカウントのURLを生成するヘルパー関数
  const getAccountUrl = (media: string, accountName: string) => {
    if (!accountName || accountName === 'Unknown') return null;
    
    const cleanName = accountName.replace('@', ''); // @記号を除去
    
    switch (media) {
      case 'TikTok':
        return `https://www.tiktok.com/@${cleanName}`;
      case 'Instagram':
        return `https://www.instagram.com/${cleanName}`;
      case 'X':
        return `https://twitter.com/${cleanName}`;
      case 'YouTube':
        return `https://www.youtube.com/@${cleanName}`;
      default:
        return null;
    }
  };

  // 媒体選択時の処理（ダッシュボード用）
  const handleDashboardMediaChange = (media: string) => {
    setDashboardMedia(media);
    setDashboardObjective(''); // 目的をリセット
  };

  // 簡易Markdownテーブル→HTML変換（表ブロックのみ）。安全のため許可タグのみ出力
  const hasMarkdownTable = (text: string): boolean => {
    if (!text) return false;
    return /\n\s*\|[^\n]+\|\s*\n\s*\|\s*[-: ]+\|/m.test(text);
  };

  const escapeHtml = (s: string): string => (
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
  );

  const linkify = (s: string): string => {
    return s.replace(/(https?:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+)/g, (m) => {
      try {
        const url = new URL(m);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          const safe = escapeHtml(m);
          return `<a href="${safe}" target="_blank" rel="noopener noreferrer" class="text-teal-400 underline">${safe}</a>`;
        }
        return escapeHtml(m);
      } catch {
        return escapeHtml(m);
      }
    });
  };

  const convertMarkdownTablesToHtml = (text: string): string => {
    if (!text) return '';
    const lines = text.split(/\r?\n/);
    let i = 0;
    let html = '';
    const openPara = () => { html += '<p class="mb-2">'; };
    const closePara = () => { html += '</p>'; };
    let inPara = false;

    const renderTable = (header: string, sep: string, bodyLines: string[]): string => {
      const splitRow = (row: string) => row.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const headers = splitRow(header);
      const rows = bodyLines.map(splitRow);
      let t = '';
      t += '<div class="overflow-x-auto"><table class="min-w-full border border-gray-700 text-sm">';
      t += '<thead><tr>' + headers.map(h => `<th class="border border-gray-700 bg-gray-800 px-3 py-2 text-left">${linkify(escapeHtml(h))}</th>`).join('') + '</tr></thead>';
      t += '<tbody>' + rows.map(r => '<tr>' + r.map(c => `<td class="border border-gray-700 px-3 py-2">${linkify(escapeHtml(c))}</td>`).join('') + '</tr>').join('') + '</tbody>';
      t += '</table></div>';
      return t;
    };

    while (i < lines.length) {
      // テーブル開始検出
      if (/^\s*\|.*\|\s*$/.test(lines[i] || '') && i + 1 < lines.length && /^\s*\|\s*[-: ]+\|.*$/.test(lines[i + 1] || '')) {
        // 直前の段落を閉じる
        if (inPara) { closePara(); inPara = false; }
        const header = lines[i];
        const sep = lines[i + 1];
        i += 2;
        const body: string[] = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
          body.push(lines[i]);
          i++;
        }
        html += renderTable(header, sep, body);
        continue;
      }

      // 通常テキスト行
      if (!inPara) { openPara(); inPara = true; }
      html += linkify(escapeHtml(lines[i]));
      html += '<br/>';
      i++;
    }
    if (inPara) closePara();
    return html;
  };

  // ------------- 簡易Markdown整形（見出し/箇条書き/リンク/コード/引用） -------------
  const extractSummary = (text: string): { bullets: string[]; rest: string } => {
    const lines = text.split(/\r?\n/);
    const bullets: string[] = [];
    let i = 0;
    while (i < lines.length && bullets.length < 5) {
      const m = lines[i].match(/^\s*(?:[-•]\s+|\d+\.\s+)(.+)$/);
      if (!m) break;
      bullets.push(m[1].trim());
      i++;
    }
    const rest = lines.slice(i).join('\n');
    return { bullets, rest };
  };

  const simpleMarkdownToHtml = (raw: string): string => {
    // コードブロック
    let text = raw.replace(/```([\s\S]*?)```/g, (_m, code) => {
      return `<pre class="bg-gray-800 border border-gray-700 rounded-md p-3 overflow-auto"><code>${escapeHtml(code)}</code></pre>`;
    });
    // 見出し
    text = text.replace(/^###\s+(.+)$/gm, '<h4 class="text-white font-semibold mt-4 mb-2">$1</h4>');
    text = text.replace(/^##\s+(.+)$/gm, '<h3 class="text-white font-bold mt-5 mb-2">$1</h3>');
    text = text.replace(/^#\s+(.+)$/gm, '<h2 class="text-white font-bold mt-6 mb-3">$1</h2>');
    // 引用
    text = text.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-gray-600 pl-3 text-gray-300">$1</blockquote>');
    // ボールド/イタリック
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // リンク [text](url)
    text = text.replace(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-700 hover:border-teal-500 text-teal-400">$1</a>');
    // 箇条書き
    const lines = text.split(/\r?\n/);
    let html = '';
    let inUl = false, inOl = false, inPara = false;
    const closePara = () => { if (inPara) { html += '</p>'; inPara = false; } };
    const closeUl = () => { if (inUl) { html += '</ul>'; inUl = false; } };
    const closeOl = () => { if (inOl) { html += '</ol>'; inOl = false; } };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*(?:- |• )/.test(line)) {
        closePara(); closeOl();
        if (!inUl) { html += '<ul class="list-disc pl-5 space-y-1">'; inUl = true; }
        html += `<li>${line.replace(/^\s*(?:- |• )/, '')}</li>`;
        continue;
      }
      if (/^\s*\d+\.\s+/.test(line)) {
        closePara(); closeUl();
        if (!inOl) { html += '<ol class="list-decimal pl-5 space-y-1">'; inOl = true; }
        html += `<li>${line.replace(/^\s*\d+\.\s+/, '')}</li>`;
        continue;
      }
      // 空行は段落区切り
      if (/^\s*$/.test(line)) {
        closePara(); closeUl(); closeOl();
        continue;
      }
      // 既にh/blockquote/preで置換済みの行はそのまま
      if (/^<h[2-4]|^<blockquote|^<pre/.test(line)) { closePara(); closeUl(); closeOl(); html += line; continue; }
      if (!inPara) { html += '<p class="leading-relaxed">'; inPara = true; }
      html += line + ' ';
    }
    closePara(); closeUl(); closeOl();
    return html;
  };

  const renderAiContent = (content: string) => {
    // 要約抽出（先頭の箇条書き最大5件）
    const { bullets, rest } = extractSummary(content);
    const base = hasMarkdownTable(rest) ? convertMarkdownTablesToHtml(rest) : simpleMarkdownToHtml(rest);

    return (
      <div className="prose prose-invert max-w-none">
        {bullets.length > 0 && (
          <div className="mb-3 rounded-md border border-teal-600/30 bg-gray-800/60 p-3">
            <div className="text-sm text-teal-300 font-semibold mb-1">要点</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {bullets.slice(0, 5).map((b, i) => (<li key={i}>{b}</li>))}
            </ul>
          </div>
        )}
        <div className="text-sm" dangerouslySetInnerHTML={{ __html: base }} />
      </div>
    );
  };

  async function handleSendMessage() {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
    };

    // ユーザーのメッセージをすぐに表示
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInputValue = inputValue;
    setInputValue("");

    // AIからの応答を待っている間のメッセージ
    const thinkingMessage: Message = {
      id: messages.length + 2,
      type: "ai",
      content: "AIが回答を生成しています...",
    };
    setMessages(prevMessages => [...prevMessages, thinkingMessage]);

    try {
      // Dify APIを呼び出し
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInputValue,
          conversation_id: "", // 必要に応じて会話IDを管理
        }),
      });

      if (!response.ok) {
        throw new Error('Dify APIからの応答がありませんでした。');
      }

      // ストリーミングレスポンスを処理
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('レスポンスボディが読み取れません。');
      }

      let aiResponseContent = "";
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.answer) {
                  aiResponseContent += parsed.answer;
                  // リアルタイムで更新
                  const updatedMessage: Message = {
                    id: messages.length + 2,
                    type: "ai",
                    content: aiResponseContent,
                  };
                  setMessages(prevMessages => prevMessages.slice(0, -1).concat(updatedMessage));
                }
              } catch (e) {
                // JSONパースエラーは無視
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // 最終的なAI応答メッセージを作成
      const aiResponseMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: aiResponseContent || "申し訳ありません。回答を生成できませんでした。",
      };

      // "検索中..."メッセージを結果に置き換え
      setMessages(prevMessages => prevMessages.slice(0, -1).concat(aiResponseMessage));

    } catch (error) {
      console.error("Dify API エラー:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: "AIとの通信中にエラーが発生しました。時間をおいて再度お試しください。",
      };
      setMessages(prevMessages => prevMessages.slice(0, -1).concat(errorMessage));
    }
  }

  const openInfluencerModal = (influencer: any) => {
    setSelectedInfluencer(influencer)
    setIsModalOpen(true)
  }

  // インフルエンサーのSNSアカウントを開く関数
  const openInfluencerAccount = (media: string, accountName: string) => {
    const url = getAccountUrl(media, accountName);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  // ツールチップの表示制御用関数
  const handleMouseEnter = (data: any) => {
    if (hideTooltipTimeout.current) {
      clearTimeout(hideTooltipTimeout.current);
    }
    setHoveredBubble(data);
  };

  const handleMouseLeave = () => {
    hideTooltipTimeout.current = setTimeout(() => {
      setHoveredBubble(null);
    }, 300);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const accountUrl = getAccountUrl(data.media, data.name);
      return (
        <div
          className="bg-gray-900/95 backdrop-blur-md border border-teal-500/30 p-4 rounded-xl shadow-2xl"
          onMouseEnter={() => handleMouseEnter(data)}
          onMouseLeave={handleMouseLeave}
        >
                      <div className="flex items-center justify-between gap-2 mb-2">
              <p className="font-bold text-white text-lg">{data.name}</p>
              {accountUrl && (
                <a 
                  href={accountUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                  title="アカウントを開く"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <Link className="h-4 w-4 text-teal-400" />
                </a>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">カテゴリ:</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">{data.category}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">CPM:</span>
                <span className="text-teal-400 font-semibold">¥{data.cpm?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">獲得単価:</span>
                <span className="text-purple-400 font-semibold">¥{data.acquisitionCost?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">配信回数:</span>
                <span className="text-gray-300">{data.campaignCount}回</span>
              </div>
            </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    if (!payload) return <g />
    const size = Math.max(12, Math.min(24, payload.campaignCount * 0.8))
    const isHovered = hoveredBubble?.name === payload.name
    const isOtherHovered = hoveredBubble && hoveredBubble.name !== payload.name

    return (
      <g>
        {/* Invisible Hitbox for mouse events */}
        <circle
          cx={cx}
          cy={cy}
          r={30} // Large radius for a stable hover area
          fill="transparent"
          onMouseEnter={() => {
            handleMouseEnter(payload)
            setCrosshairPosition({ x: cx, y: cy })
          }}
          onMouseLeave={() => {
            handleMouseLeave()
            setCrosshairPosition(null)
          }}
          className="cursor-pointer"
        />
        
        {/* Glow effect */}
        {isHovered && (
          <circle
            cx={cx}
            cy={cy}
            r={size + 8}
            fill={payload.color}
            fillOpacity={0.1}
            className="animate-pulse pointer-events-none"
            style={{
              filter: `drop-shadow(0 0 20px ${payload.color}80)`,
            }}
          />
        )}
        {/* Main bubble */}
        <circle
          cx={cx}
          cy={cy}
          r={size}
          fill={payload.color}
          fillOpacity={isOtherHovered ? 0.3 : 0.8}
          className={`transition-all duration-300 ease-in-out pointer-events-none ${isHovered ? "scale-115" : "scale-100"}`}
          style={{
            filter: isHovered ? `drop-shadow(0 0 15px ${payload.color}60)` : "none",
            transform: isHovered ? "scale(1.15)" : "scale(1)",
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />
      </g>
    )
  }



  const renderDashboard = () => (
    <div className="space-y-8">
      {/* プルダウン選択 */}
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 媒体選択 */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">媒体</label>
              <Select value={dashboardMedia} onValueChange={setDashboardMedia}>
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
                      !dashboardObjective && "text-gray-400"
                    )}
                  >
                    {dashboardObjective || "目的を選択してください"}
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
                              setDashboardObjective(currentValue === dashboardObjective ? "" : currentValue);
                            }}
                            className="text-white hover:bg-gray-700"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                dashboardObjective === objective ? "opacity-100" : "opacity-0"
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
                <p className="text-gray-400 text-sm">
                  平均CPM
                  {dashboardMedia !== 'all' && (
                    <span className="text-xs text-gray-500 ml-2">({dashboardMedia})</span>
                  )}
                </p>
                <p className="text-4xl font-bold text-white">
                  ¥{calculateFilteredStatistics().cpm.avg.toFixed(3)}
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
                <p className="text-gray-400 text-sm">
                  {currentPriceLabel}
                  {dashboardMedia !== 'all' && dashboardObjective && (
                    <span className="text-xs text-gray-500 ml-2">({dashboardMedia} - {dashboardObjective})</span>
                  )}
                </p>
                <p className="text-4xl font-bold text-white">
                  ¥{calculateFilteredStatistics().acquisitionCost.avg.toFixed(3)}
                </p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"></div>
          </CardContent>
        </Card>
      </div>

      {/* 詳細統計テーブル */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* CPM統計 */}
        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              CPM統計
              {dashboardMedia !== 'all' && (
                <span className="text-sm text-gray-400 ml-2">({dashboardMedia})</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">最大:</span>
                  <span className="text-white font-mono">¥{calculateFilteredStatistics().cpm.max.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">最小:</span>
                  <span className="text-white font-mono">¥{calculateFilteredStatistics().cpm.min.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">平均:</span>
                  <span className="text-white font-mono">¥{calculateFilteredStatistics().cpm.avg.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">中央値:</span>
                  <span className="text-white font-mono">¥{calculateFilteredStatistics().cpm.median.toFixed(3)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">データ件数:</span>
                  <span className="text-white font-mono">{calculateFilteredStatistics().cpm.count}件</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 獲得単価統計 */}
        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              {currentPriceLabel}統計
              {dashboardMedia !== 'all' && dashboardObjective && (
                <span className="text-sm text-gray-400 ml-2">({dashboardMedia} - {dashboardObjective})</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">最大:</span>
                  <span className="text-white font-mono">¥{calculateFilteredStatistics().acquisitionCost.max.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">最小:</span>
                  <span className="text-white font-mono">¥{calculateFilteredStatistics().acquisitionCost.min.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">平均:</span>
                  <span className="text-white font-mono">¥{calculateFilteredStatistics().acquisitionCost.avg.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">中央値:</span>
                  <span className="text-white font-mono">¥{calculateFilteredStatistics().acquisitionCost.median.toFixed(3)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">データ件数:</span>
                  <span className="text-white font-mono">{calculateFilteredStatistics().acquisitionCost.count}件</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ 2カラム */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* パフォーマンス可視化 */}
        <div>
          <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 h-[460px] lg:h-[520px]">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                {dashboardObjective ? `${dashboardObjective}パフォーマンス可視化` : 'パフォーマンス可視化'}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-4 pt-3 pb-5">
              <div className="h-full relative px-1 pb-2 overflow-visible">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 12, bottom: 56, left: 40 }}>
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
                      tickFormatter={(value) => `¥${Number(value).toFixed(2)}`}
                      label={{ value: "CPM単価 (円)", position: "insideBottom", offset: -6, style: { fontSize: 11, fill: '#A3A3A3' } }}
                      tick={{ fill: "#A3A3A3", fontSize: 12 }}
                      tickMargin={8}
                    />
                    <YAxis
                      type="number"
                      dataKey="acquisitionCost"
                      name="獲得単価"
                      tickFormatter={(value) => `¥${Number(value).toFixed(2)}`}
                      label={{ value: `${currentPriceLabel} (円)`, angle: -90, position: "insideLeft", offset: 6, style: { fontSize: 11, fill: '#A3A3A3' } }}
                      tick={{ fill: "#A3A3A3", fontSize: 12 }}
                      tickMargin={8}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {realData.length > 0 ? (
                      <>
                        <Scatter data={realData} shape={CustomDot} />
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
            <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 h-[460px] lg:h-[520px]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-teal-400" />
                  AI アシスタント
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  AIアシスタントと対話して 過後実績からインフルエンサーが検索できます
                </p>
              </CardHeader>
            <CardContent className="h-[calc(100%-64px)] flex flex-col space-y-4">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
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
                        {renderAiContent(message.content)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="インフルエンサー選定やキャンペーン戦略について質問してください..."
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
        </div>
      </div>
    </div>
  )

  const renderSearch = () => (
    <div className="space-y-6">
      {/* 検索フィルター */}
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardContent className="p-6">
          {/* プルダウンフィルター */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">媒体</label>
              <Select value={selectedMedia} onValueChange={handleMediaChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全媒体</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="X">X</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">目的</label>
              <Select value={selectedObjective} onValueChange={handleObjectiveChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全目的</SelectItem>
                  {availableSearchObjectives.map((obj) => (
                    <SelectItem key={obj} value={obj}>{obj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">商材ジャンル</label>
              <Select value={selectedProductGenre} onValueChange={handleProductGenreChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全ジャンル</SelectItem>
                  {availableProductGenres.map((pg) => (
                    <SelectItem key={pg} value={pg}>{pg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">商品</label>
              <Select value={selectedProduct} onValueChange={handleProductChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全商品</SelectItem>
                  {availableProducts.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">モデルカテゴリ</label>
              <Select value={selectedModelCategory} onValueChange={handleModelCategoryChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全カテゴリ</SelectItem>
                  {availableModelCategories.map((mc) => (
                    <SelectItem key={mc} value={mc}>{mc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


          </div>

          {/* 期間フィルター */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">配信開始日</label>
              <Input
                type="date"
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value || null)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">配信終了日</label>
              <Input
                type="date"
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value || null)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {/* 検索実行ボタン */}
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              onClick={executeSearch}
              disabled={isSearching}
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-8 py-3 text-lg"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  検索中...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-3" />
                  検索実行
                </>
              )}
            </Button>
            <Button 
              onClick={clearSearchFilters}
              disabled={isSearching}
              className="bg-gray-700 hover:bg-gray-600 px-8 py-3 text-lg"
            >
              <X className="h-5 w-5 mr-3" />
              検索条件クリア
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 検索結果 */}
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">
              検索結果 ({searchResults.length}件)
              {searchResults.length > 0 && (
                <span className="text-sm text-gray-400 ml-2">
                  (全データ: 1000+件)
                </span>
              )}
            </CardTitle>
            
            {/* 並び替え機能 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">並び替え:</span>
                <Select value={sortField} onValueChange={handleSortFieldChange}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="CPM">CPM</SelectItem>
                    <SelectItem value="リーチ単価">リーチ単価</SelectItem>
                    <SelectItem value="FQ">FQ</SelectItem>
                    <SelectItem value="CTR">CTR</SelectItem>
                    <SelectItem value="CPC">CPC</SelectItem>
                    <SelectItem value="単価数値">単価数値</SelectItem>
                    <SelectItem value="アカウント名">アカウント名</SelectItem>
                    <SelectItem value="ハンドル名">ハンドル名</SelectItem>
                    <SelectItem value="モデルカテゴリ">モデルカテゴリ</SelectItem>
                    <SelectItem value="商品">商品</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="p-2 h-8 w-8 bg-gray-800 hover:bg-gray-700"
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 媒体別サマリー（特定媒体選択時のみ）：表形式 */}
          {selectedMedia !== 'all' && searchResults.length > 0 && (
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2">媒体別サマリー（{selectedMedia}）</div>
              <div className="overflow-auto rounded-md border border-gray-700">
                <table className="min-w-full text-sm bg-gray-800/60">
                  <thead>
                    <tr className="text-gray-300">
                      <th className="px-4 py-3 text-left bg-gray-900/50">計指標</th>
                      {metricsByMedia[selectedMedia]?.map((m) => (
                        <th key={`h-${m.label}`} className="px-4 py-3 text-left bg-gray-900/50 whitespace-nowrap">{m.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['平均値', '最大値', '最小値', '中央値'].map((rowLabel) => (
                      <tr key={rowLabel} className="border-t border-gray-700">
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{rowLabel}</td>
                        {metricsByMedia[selectedMedia]?.map((metric) => {
                          const values: number[] = searchResults
                            .map((row: any) => pickNumberByKeys(row, metric.keys))
                            .filter((v): v is number => v !== undefined)
                          const stats = computeStats(values)
                          const value = rowLabel === '平均値' ? stats?.avg
                            : rowLabel === '最大値' ? stats?.max
                            : rowLabel === '最小値' ? stats?.min
                            : stats?.median
                          return (
                            <td key={`${rowLabel}-${metric.label}`} className="px-4 py-3 text-white whitespace-nowrap">
                              {formatValue(value, metric.type)}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-[11px] text-gray-500 px-4 py-2 text-right">表示中データに基づく</div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.length > 0 ? (
              sortResults(searchResults).map((influencer, index) => (
                <Card
                  key={`search-${index}`}
                  className="bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                >
                                     <CardContent className="p-4">
                    <div className="mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {influencer.account_name 
                            || influencer.アカウント名 
                            || influencer.handle_name 
                            || influencer.ハンドル名 
                            || influencer.name
                            || 'Unknown'}
                        </h4>
                        {(influencer.handle_name || influencer.ハンドル名) && (
                          <p className="text-xs text-gray-400">{influencer.handle_name || influencer.ハンドル名}</p>
                        )}
                        <p className="text-sm text-gray-400">
                          {influencer.model_category 
                            || influencer.モデルカテゴリ 
                            || influencer.realName 
                            || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPM:</span>
                        <span className="text-white">{formatValue(pickNumberByKeys(influencer, ['cpm', 'CPM']), 'currency')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">リーチ単価:</span>
                        <span className="text-white">{formatValue(pickNumberByKeys(influencer, ['reach_cost', '単価数値']), 'currency')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">FQ:</span>
                        <span className="text-white">{formatValue(pickNumberByKeys(influencer, ['fq', 'FQ']), 'number')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">CTR:</span>
                        <span className="text-white">{formatValue(pickNumberByKeys(influencer, ['ctr', 'CTR', 'car']), 'percent')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPC:</span>
                        <span className="text-white">{formatValue(pickNumberByKeys(influencer, ['cpc', 'CPC']), 'currency')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">媒体:</span>
                        <span className="text-white">{(selectedMedia && selectedMedia !== 'all') ? selectedMedia : (influencer.media || influencer.媒体 || 'N/A')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">目的:</span>
                        <span className="text-white">{influencer.objective || influencer.目的 || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">モデルカテゴリ:</span>
                        <span className="text-white">{influencer.model_category || influencer.モデルカテゴリ || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">商品実績:</span>
                        <span className="text-white">{influencer.product || influencer.商品 || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {(() => {
                        const postUrl: string | undefined = influencer.post_url_display || influencer.post_url
                        const isValid = typeof postUrl === 'string' && /^https?:\/\//.test(postUrl)
                        const handle = influencer.handle_name || influencer.ハンドル名 || influencer.account_name || influencer.アカウント名 || ''
                        const aria = handle ? `投稿リンクを開く（${handle}）` : '投稿リンクを開く'
                        const onOpen = () => {
                          if (isValid && postUrl) window.open(postUrl, '_blank', 'noopener,noreferrer')
                        }
                        return (
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600"
                            onClick={onOpen}
                            disabled={!isValid}
                            aria-label={aria}
                            title={isValid ? aria : 'URLがありません'}
                          >
                            投稿リンクを開く
                          </Button>
                        )
                      })()}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-lg mb-2">検索条件を設定して「検索実行」をクリックしてください</div>
                <div className="text-gray-500 text-sm">検索結果がここに表示されます</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLists = () => (
    <div className="space-y-6">
      {/* ヘッダーと統計情報 */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{savedLists.length}</p>
                <p className="text-sm text-gray-400">保存済みリスト</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {savedLists.reduce((total, list) => total + list.influencers.length, 0)}
                </p>
                <p className="text-sm text-gray-400">総インフルエンサー数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {(savedLists.reduce((total, list) => total + list.totalFollowers, 0) / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-gray-400">総フォロワー数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  ¥{(savedLists.reduce((total, list) => total + list.budget.max, 0) / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-gray-400">総予算上限</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルタリング・アクション */}
      <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              {/* 検索バー */}
              <div className="flex-1 max-w-md">
                <Input
                  value={listSearchQuery}
                  onChange={(e) => setListSearchQuery(e.target.value)}
                  placeholder="リスト名で検索..."
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>

              {/* カテゴリフィルター */}
              <Select value={listCategoryFilter} onValueChange={setListCategoryFilter}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全カテゴリ</SelectItem>
                  <SelectItem value="コスメ">コスメ</SelectItem>
                  <SelectItem value="グルメ">グルメ</SelectItem>
                  <SelectItem value="旅行">旅行</SelectItem>
                  <SelectItem value="ファッション">ファッション</SelectItem>
                </SelectContent>
              </Select>

              {/* ステータスフィルター */}
              <Select value={listStatusFilter} onValueChange={setListStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全ステータス</SelectItem>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="active">アクティブ</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 新規作成ボタン */}
            <Button 
              onClick={() => openListModal()}
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規リスト作成
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ 2カラム */}
      <div className="grid grid-cols-4 gap-6 h-full">
        {/* 左カラム: リスト一覧 */}
        <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">保存済みリスト ({filteredLists.length}件)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredLists.map((list) => (
              <Card
                key={list.id}
                className={`cursor-pointer transition-all duration-300 group ${
                  activeList === list.id
                    ? "bg-purple-500/20 border-purple-500/50"
                    : "bg-gray-800/50 border-gray-700 hover:border-purple-500/30"
                }`}
                onClick={() => setActiveList(list.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {list.name}
                    </h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          openListModal(list)
                        }}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteList(list.id)
                        }}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {list.description && (
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">{list.description}</p>
                  )}
                  
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>{list.influencers.length}名のインフルエンサー</p>
                    <p>総フォロワー: {(list.totalFollowers / 1000).toFixed(1)}K</p>
                    <p>予算: {list.estimatedCost}</p>
                  </div>
                  
                  {/* タグ */}
                  {list.tags && list.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {list.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* ステータス */}
                  <div className="mt-2">
                    <Badge 
                      variant={list.status === 'active' ? 'default' : list.status === 'completed' ? 'secondary' : 'outline'}
                      className={`text-xs ${
                        list.status === 'active' ? 'bg-green-500 text-white' :
                        list.status === 'completed' ? 'bg-blue-500 text-white' :
                        'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {list.status === 'draft' ? '下書き' : 
                       list.status === 'active' ? 'アクティブ' : '完了'}
                    </Badge>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">
                    {savedLists.find((list) => list.id === activeList)?.name}
                  </CardTitle>
                  {savedLists.find((list) => list.id === activeList)?.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {savedLists.find((list) => list.id === activeList)?.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    エクスポート
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    共有
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedLists
                  .find((list) => list.id === activeList)
                  ?.influencers.map((influencerId) => {
                    // リスト管理は現在の実装ではモックデータを使用
                    const mockInfluencer = {
                      id: influencerId,
                      name: `インフルエンサー${influencerId}`,
                      realName: `@influencer_${influencerId}`,
                      followers: 100000,
                      engagement: 5.0,
                      avatar: "/placeholder.svg"
                    }
                    
                    return (
                      <Card key={mockInfluencer.id} className="bg-gray-800/50 border border-gray-700 group">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <DragHandleDots2 className="h-5 w-5 text-gray-500 cursor-move hover:text-gray-300 transition-colors" />
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={mockInfluencer.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{mockInfluencer.name.slice(1, 3).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{mockInfluencer.name}</h4>
                              <p className="text-sm text-gray-400">{mockInfluencer.realName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">フォロワー</p>
                              <p className="text-white font-semibold">{(mockInfluencer.followers / 1000).toFixed(1)}K</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">エンゲージメント</p>
                              <p className="text-white font-semibold">{mockInfluencer.engagement}%</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                              >
                                詳細
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeInfluencerFromList(activeList, mockInfluencer.id)}
                                className="border-red-600 text-red-400 bg-transparent hover:bg-red-600 hover:text-white"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                
                {/* インフルエンサー追加ボタン */}
                <Card 
                  className="bg-gray-800/30 border border-dashed border-gray-600 hover:border-purple-500/50 transition-colors cursor-pointer group"
                  onClick={() => setIsAddInfluencerModalOpen(true)}
                >
                  <CardContent className="p-6 text-center">
                    <Plus className="h-8 w-8 text-gray-500 group-hover:text-purple-400 mx-auto mb-2 transition-colors" />
                    <p className="text-gray-400 group-hover:text-purple-300 transition-colors">
                      インフルエンサーを追加
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
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
            // { id: "lists", icon: Star, label: "リスト管理" },
            // { id: "reports", icon: FileDown, label: "レポート" },
            // { id: "settings", icon: Settings, label: "設定" },
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

      {/* リスト作成・編集モーダル */}
      <Dialog open={isListModalOpen} onOpenChange={setIsListModalOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 max-w-2xl animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingList ? "リストを編集" : "新規リスト作成"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">リスト名 *</label>
                <Input
                  value={listFormData.name}
                  onChange={(e) => setListFormData({ ...listFormData, name: e.target.value })}
                  placeholder="例: 2025年夏コスメ案件"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">説明</label>
                <textarea
                  value={listFormData.description}
                  onChange={(e) => setListFormData({ ...listFormData, description: e.target.value })}
                  placeholder="リストの目的や詳細を記入してください"
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 rounded-md px-3 py-2 resize-none"
                />
              </div>
            </div>

            {/* カテゴリとステータス */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">カテゴリ</label>
                <Select value={listFormData.category} onValueChange={(value) => setListFormData({ ...listFormData, category: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="コスメ">コスメ</SelectItem>
                    <SelectItem value="グルメ">グルメ</SelectItem>
                    <SelectItem value="旅行">旅行</SelectItem>
                    <SelectItem value="ファッション">ファッション</SelectItem>
                    <SelectItem value="テック">テック</SelectItem>
                    <SelectItem value="ゲーム">ゲーム</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">ステータス</label>
                <Select value={listFormData.status} onValueChange={(value) => setListFormData({ ...listFormData, status: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="active">アクティブ</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 予算設定 */}
            <div className="space-y-4">
              <label className="text-sm text-gray-400 mb-2 block">予算範囲</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">最小予算</label>
                  <Input
                    type="number"
                    value={listFormData.budgetMin}
                    onChange={(e) => setListFormData({ ...listFormData, budgetMin: e.target.value })}
                    placeholder="0"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">最大予算</label>
                  <Input
                    type="number"
                    value={listFormData.budgetMax}
                    onChange={(e) => setListFormData({ ...listFormData, budgetMax: e.target.value })}
                    placeholder="0"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* タグ */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">タグ</label>
              <Input
                value={listFormData.tags}
                onChange={(e) => setListFormData({ ...listFormData, tags: e.target.value })}
                placeholder="夏, コスメ, 2025 (カンマで区切って入力)"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">カンマで区切って複数のタグを入力できます</p>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleListSubmit}
                disabled={!listFormData.name.trim()}
                className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50"
              >
                {editingList ? "更新" : "作成"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsListModalOpen(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* インフルエンサー追加モーダル */}
      <Dialog open={isAddInfluencerModalOpen} onOpenChange={setIsAddInfluencerModalOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 max-w-4xl animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              インフルエンサーを追加
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* 検索・フィルタリング */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  value={addInfluencerSearchQuery}
                  onChange={(e) => setAddInfluencerSearchQuery(e.target.value)}
                  placeholder="インフルエンサー名で検索..."
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>
              <Select value={addInfluencerCategoryFilter} onValueChange={setAddInfluencerCategoryFilter}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全カテゴリ</SelectItem>
                  <SelectItem value="コスメ">コスメ</SelectItem>
                  <SelectItem value="グルメ">グルメ</SelectItem>
                  <SelectItem value="旅行">旅行</SelectItem>
                  <SelectItem value="ファッション">ファッション</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* インフルエンサー一覧 */}
            <div className="max-h-96 overflow-y-auto space-y-3">
              {searchResults.length > 0 ? (
                searchResults
                  .filter(influencer => {
                    const matchesSearch = (influencer.name || influencer.アカウント名 || influencer.ハンドル名 || '')
                      .toLowerCase().includes(addInfluencerSearchQuery.toLowerCase())
                    const matchesCategory = addInfluencerCategoryFilter === "all" || 
                      influencer.モデルカテゴリ === addInfluencerCategoryFilter
                    return matchesSearch && matchesCategory
                  })
                  .map((influencer, index) => {
                    const isAlreadyInList = savedLists
                      .find(list => list.id === activeList)
                      ?.influencers.includes(index)
                    
                    return (
                      <Card key={`add-${index}`} className="bg-gray-800/50 border border-gray-700">
                                                 <CardContent className="p-4">
                           <div className="flex items-center gap-4">
                             <div className="flex-1">
                              <h4 className="font-semibold text-white">
                                {influencer.name || influencer.アカウント名 || influencer.ハンドル名 || 'Unknown'}
                              </h4>
                              <p className="text-sm text-gray-400">{influencer.モデルカテゴリ || 'N/A'}</p>
                              <p className="text-xs text-gray-500">
                                CPM: ¥{influencer.CPM?.toFixed(2) || 'N/A'} | 単価: ¥{influencer.単価数値?.toFixed(2) || 'N/A'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">媒体</p>
                              <p className="text-white font-semibold">{influencer.媒体 || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">目的</p>
                              <p className="text-white font-semibold">{influencer.目的 || 'N/A'}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                if (isAlreadyInList) {
                                  removeInfluencerFromList(activeList, index)
                                } else {
                                  addInfluencerToList(activeList, index)
                                }
                              }}
                              disabled={isAlreadyInList}
                              className={`${
                                isAlreadyInList
                                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                  : "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                              }`}
                            >
                              {isAlreadyInList ? "追加済み" : "追加"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm mb-2">検索を実行すると</div>
                  <div className="text-gray-500 text-xs">インフルエンサーが表示されます</div>
                </div>
              )}
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddInfluencerModalOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                閉じる
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
