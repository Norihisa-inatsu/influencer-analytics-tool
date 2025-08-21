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
  Sun,
  Moon,
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
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "こんにちは！Dify AIアシスタントです。インフルエンサー選定やキャンペーン戦略について、何でもお気軽にお聞きください。例えば：\n\n• 「美容系のインフルエンサーを探したい」\n• 「10万円以下の予算で効果的なキャンペーンを組みたい」\n• 「Z世代向けのSNS戦略について教えて」",
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
  const [selectedMedia, setSelectedMedia] = useState("all")
  const [selectedObjective, setSelectedObjective] = useState("all")
  const [selectedModelCategory, setSelectedModelCategory] = useState("all")
  const [selectedProductGenre, setSelectedProductGenre] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // 並び替え機能の状態
  const [sortField, setSortField] = useState('CPM')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // 並び替え関数
  const sortResults = (results: any[]) => {
    if (!results || results.length === 0) return results;
    
    return [...results].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // 数値の場合は数値として比較
      if (typeof aValue === 'string' && aValue.includes('¥')) {
        aValue = parseFloat(aValue.replace('¥', '').replace(',', '')) || 0;
        bValue = parseFloat(bValue.replace('¥', '').replace(',', '')) || 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
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
      const url = new URL('/api/schema', window.location.origin);
      url.searchParams.append('field', field);
      
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
    setSelectedModelCategory('all');
    setSelectedProductGenre('all');
    setSelectedProduct('all');
    
    // モデルカテゴリの選択肢を更新
    updateAvailableOptions('モデルカテゴリ', { 
      media: selectedMedia, 
      objective 
    });
  };

  // モデルカテゴリ選択時の処理
  const handleModelCategoryChange = (modelCategory: string) => {
    setSelectedModelCategory(modelCategory);
    setSelectedProductGenre('all');
    setSelectedProduct('all');
    
    // 商材ジャンルの選択肢を更新
    updateAvailableOptions('商材ジャンル', { 
      media: selectedMedia, 
      objective: selectedObjective, 
      modelCategory 
    });
  };

  // 商材ジャンル選択時の処理
  const handleProductGenreChange = (productGenre: string) => {
    setSelectedProductGenre(productGenre);
    setSelectedProduct('all');
    
    // 商品の選択肢を更新
    updateAvailableOptions('商品', { 
      media: selectedMedia, 
      objective: selectedObjective, 
      modelCategory: selectedModelCategory, 
      productGenre 
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
      

      
      console.log('検索API呼び出し:', url.toString());
      console.log('検索条件:', {
        media: selectedMedia,
        objective: selectedObjective,
        modelCategory: selectedModelCategory,
        productGenre: selectedProductGenre,
        product: selectedProduct
      });
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`検索APIエラー: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('検索結果:', result);
      console.log('取得件数:', result.data?.length || 0);
      
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

  // 初期化時に各項目の選択肢を取得
  useEffect(() => {
    // 初期化時は全データから選択肢を取得
    updateAvailableOptions('目的', {});
    updateAvailableOptions('モデルカテゴリ', {});
    updateAvailableOptions('商材ジャンル', {});
    updateAvailableOptions('商品', {});
  }, []);

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
      <div className="grid grid-cols-3 gap-8">
        {/* パフォーマンス可視化 */}
        <div className="col-span-2">
          <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 h-full">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                {dashboardObjective ? `${dashboardObjective}パフォーマンス可視化` : 'パフォーマンス可視化'}
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
                      tickFormatter={(value) => `¥${Number(value).toFixed(2)}`}
                      label={{ value: "CPM単価 (円)", position: "insideBottom", offset: -10 }}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="acquisitionCost"
                      name="獲得単価"
                      tickFormatter={(value) => `¥${Number(value).toFixed(2)}`}
                      label={{ value: `${currentPriceLabel} (円)`, angle: -90, position: "insideLeft" }}
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
                  AI アシスタント
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Dify AIと対話して、インフルエンサー選定やキャンペーン戦略について相談できます
                </p>
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

          {/* 推奨インフルエンサー */}
          <Card className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-white">推奨インフルエンサー</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {searchResults.length > 0 ? (
                searchResults.slice(0, 3).map((influencer, index) => (
                  <Card
                    key={`dashboard-${index}`}
                    className="bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group"
                    onClick={() => openInfluencerModal(influencer)}
                  >
                                         <CardContent className="p-4">
                       <div className="flex items-center gap-3">
                         <div className="flex-1">
                          <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {influencer.name || influencer.アカウント名 || influencer.ハンドル名 || 'Unknown'}
                          </h4>
                          <p className="text-xs text-gray-400 mb-1">{influencer.モデルカテゴリ || 'N/A'}</p>
                          <p className="text-xs text-gray-500">
                            CPM: ¥{influencer.CPM?.toFixed(2) || 'N/A'} | 単価: ¥{influencer.単価数値?.toFixed(2) || 'N/A'}
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
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm mb-2">検索を実行すると</div>
                  <div className="text-gray-500 text-xs">推奨インフルエンサーが表示されます</div>
                </div>
              )}
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
                  <SelectItem value="リーチ">リーチ</SelectItem>
                  <SelectItem value="動画視聴">動画視聴</SelectItem>
                  <SelectItem value="トラフィック">トラフィック</SelectItem>
                  <SelectItem value="完全視聴">完全視聴</SelectItem>
                  <SelectItem value="ENG">ENG</SelectItem>
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
                  <SelectItem value="ライフスタイル">ライフスタイル</SelectItem>
                  <SelectItem value="モデル">モデル</SelectItem>
                  <SelectItem value="美容">美容</SelectItem>
                  <SelectItem value="エンタメ">エンタメ</SelectItem>
                  <SelectItem value="カップル">カップル</SelectItem>
                  <SelectItem value="ファミリー">ファミリー</SelectItem>
                  <SelectItem value="旅行">旅行</SelectItem>
                  <SelectItem value="料理">料理</SelectItem>
                  <SelectItem value="企業">企業</SelectItem>
                  <SelectItem value="スポーツ">スポーツ</SelectItem>
                  <SelectItem value="スポーツメディア">スポーツメディア</SelectItem>
                  <SelectItem value="ファッション">ファッション</SelectItem>
                  <SelectItem value="ガジェット">ガジェット</SelectItem>
                  <SelectItem value="ママ">ママ</SelectItem>
                  <SelectItem value="Vtuber">Vtuber</SelectItem>
                  <SelectItem value="芸人">芸人</SelectItem>
                  <SelectItem value="コラージュ">コラージュ</SelectItem>
                  <SelectItem value="推し活">推し活</SelectItem>
                  <SelectItem value="イラスト">イラスト</SelectItem>
                  <SelectItem value="ペット">ペット</SelectItem>
                  <SelectItem value="キャンプ">キャンプ</SelectItem>
                  <SelectItem value="ヘアアレンジ">ヘアアレンジ</SelectItem>
                  <SelectItem value="社長">社長</SelectItem>
                  <SelectItem value="YouTuber">YouTuber</SelectItem>
                  <SelectItem value="タレント">タレント</SelectItem>
                  <SelectItem value="アイドル">アイドル</SelectItem>
                  <SelectItem value="生活情報">生活情報</SelectItem>
                  <SelectItem value="暮らし">暮らし</SelectItem>
                  <SelectItem value="美容師">美容師</SelectItem>
                  <SelectItem value="美容メディア">美容メディア</SelectItem>
                  <SelectItem value="キッズ">キッズ</SelectItem>
                  <SelectItem value="Ripre会員">Ripre会員</SelectItem>
                  <SelectItem value="美容家">美容家</SelectItem>
                  <SelectItem value="韓ドラ">韓ドラ</SelectItem>
                  <SelectItem value="ポイ活">ポイ活</SelectItem>
                  <SelectItem value="to buy動画">to buy動画</SelectItem>
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
                  <SelectItem value="日用品">日用品</SelectItem>
                  <SelectItem value="ヘアケア">ヘアケア</SelectItem>
                  <SelectItem value="コスメ">コスメ</SelectItem>
                  <SelectItem value="スキンケア">スキンケア</SelectItem>
                  <SelectItem value="家電">家電</SelectItem>
                  <SelectItem value="サービス">サービス</SelectItem>
                  <SelectItem value="薬品">薬品</SelectItem>
                  <SelectItem value="食品">食品</SelectItem>
                  <SelectItem value="スポーツ用品">スポーツ用品</SelectItem>
                  <SelectItem value="メンズスキンケア">メンズスキンケア</SelectItem>
                  <SelectItem value="商業施設">商業施設</SelectItem>
                  <SelectItem value="決済サービス">決済サービス</SelectItem>
                  <SelectItem value="おもちゃ">おもちゃ</SelectItem>
                  <SelectItem value="飲料">飲料</SelectItem>
                  <SelectItem value="ベビー用品">ベビー用品</SelectItem>
                  <SelectItem value="文房具">文房具</SelectItem>
                  <SelectItem value="ペット用品">ペット用品</SelectItem>
                  <SelectItem value="メンズコスメ">メンズコスメ</SelectItem>
                  <SelectItem value="小売業">小売業</SelectItem>
                  <SelectItem value="通販サイト">通販サイト</SelectItem>
                  <SelectItem value="メイク用品">メイク用品</SelectItem>
                  <SelectItem value="ネイル">ネイル</SelectItem>
                  <SelectItem value="コスメ・スキンケア">コスメ・スキンケア</SelectItem>
                  <SelectItem value="生活雑貨">生活雑貨</SelectItem>
                  <SelectItem value="アプリ">アプリ</SelectItem>
                  <SelectItem value="美容家電">美容家電</SelectItem>
                  <SelectItem value="サブスク">サブスク</SelectItem>
                  <SelectItem value="ヘアオイル">ヘアオイル</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">商品</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全商品</SelectItem>
                  <SelectItem value="香りづけ剤">香りづけ剤</SelectItem>
                  <SelectItem value="ヘアオイル">ヘアオイル</SelectItem>
                  <SelectItem value="スタイリング剤">スタイリング剤</SelectItem>
                  <SelectItem value="柔軟剤">柔軟剤</SelectItem>
                  <SelectItem value="ファンデ・スキンケア">ファンデ・スキンケア</SelectItem>
                  <SelectItem value="ベースメイク">ベースメイク</SelectItem>
                  <SelectItem value="メガネ洗浄液">メガネ洗浄液</SelectItem>
                  <SelectItem value="掃除用品">掃除用品</SelectItem>
                  <SelectItem value="美容液">美容液</SelectItem>
                  <SelectItem value="シートマスク">シートマスク</SelectItem>
                  <SelectItem value="柔軟剤・香りづけ剤">柔軟剤・香りづけ剤</SelectItem>
                  <SelectItem value="トレーニンググッズ">トレーニンググッズ</SelectItem>
                  <SelectItem value="フレグランス">フレグランス</SelectItem>
                  <SelectItem value="化粧水">化粧水</SelectItem>
                  <SelectItem value="洗濯用洗剤">洗濯用洗剤</SelectItem>
                  <SelectItem value="ドライシャンプー・冷タオル・ヘアカラー">ドライシャンプー・冷タオル・ヘアカラー</SelectItem>
                  <SelectItem value="歯磨き粉">歯磨き粉</SelectItem>
                  <SelectItem value="胃腸薬">胃腸薬</SelectItem>
                  <SelectItem value="保湿クリーム">保湿クリーム</SelectItem>
                  <SelectItem value="シャンプー＆トリートメント">シャンプー＆トリートメント</SelectItem>
                  <SelectItem value="オリーブオイル">オリーブオイル</SelectItem>
                  <SelectItem value="リップ">リップ</SelectItem>
                  <SelectItem value="サポーター">サポーター</SelectItem>
                  <SelectItem value="フェイシャルシート">フェイシャルシート</SelectItem>
                  <SelectItem value="シャンプー&トリートメント">シャンプー&トリートメント</SelectItem>
                  <SelectItem value="日焼け止め">日焼け止め</SelectItem>
                  <SelectItem value="電子マネー">電子マネー</SelectItem>
                  <SelectItem value="アイシャドウ">アイシャドウ</SelectItem>
                  <SelectItem value="全般">全般</SelectItem>
                  <SelectItem value="おもちゃ">おもちゃ</SelectItem>
                  <SelectItem value="ブラシ">ブラシ</SelectItem>
                  <SelectItem value="トローチ">トローチ</SelectItem>
                  <SelectItem value="リップクリーム">リップクリーム</SelectItem>
                  <SelectItem value="アイメイク">アイメイク</SelectItem>
                  <SelectItem value="アウトレット">アウトレット</SelectItem>
                  <SelectItem value="クレイパック">クレイパック</SelectItem>
                  <SelectItem value="クレンジング">クレンジング</SelectItem>
                  <SelectItem value="メイクブラシ">メイクブラシ</SelectItem>
                  <SelectItem value="マスカラ">マスカラ</SelectItem>
                  <SelectItem value="洗顔">洗顔</SelectItem>
                  <SelectItem value="エナジードリンク">エナジードリンク</SelectItem>
                  <SelectItem value="入浴剤">入浴剤</SelectItem>
                  <SelectItem value="全身シャンプー">全身シャンプー</SelectItem>
                  <SelectItem value="推し活グッズ">推し活グッズ</SelectItem>
                  <SelectItem value="炭酸飲料">炭酸飲料</SelectItem>
                  <SelectItem value="クレンジング・洗顔">クレンジング・洗顔</SelectItem>
                  <SelectItem value="アイブロウ">アイブロウ</SelectItem>
                  <SelectItem value="セルフカラー剤">セルフカラー剤</SelectItem>
                  <SelectItem value="ダイエット食品">ダイエット食品</SelectItem>
                  <SelectItem value="付箋">付箋</SelectItem>
                  <SelectItem value="電動鼻吸い器">電動鼻吸い器</SelectItem>
                  <SelectItem value="テーマパーク">テーマパーク</SelectItem>
                  <SelectItem value="アイライナー">アイライナー</SelectItem>
                  <SelectItem value="ブランド品">ブランド品</SelectItem>
                  <SelectItem value="ヘアスタイリング">ヘアスタイリング</SelectItem>
                  <SelectItem value="フェイスパック">フェイスパック</SelectItem>
                  <SelectItem value="油">油</SelectItem>
                  <SelectItem value="豆乳">豆乳</SelectItem>
                  <SelectItem value="掃除用器具">掃除用器具</SelectItem>
                  <SelectItem value="コンシーラー">コンシーラー</SelectItem>
                  <SelectItem value="美容液・ファンデーション">美容液・ファンデーション</SelectItem>
                  <SelectItem value="調味料">調味料</SelectItem>
                  <SelectItem value="楽天市場">楽天市場</SelectItem>
                  <SelectItem value="マッサージチェア">マッサージチェア</SelectItem>
                  <SelectItem value="掃除用洗剤">掃除用洗剤</SelectItem>
                  <SelectItem value="ミニネイル">ミニネイル</SelectItem>
                  <SelectItem value="食器洗剤">食器洗剤</SelectItem>
                  <SelectItem value="ネイル">ネイル</SelectItem>
                  <SelectItem value="掃除用具">掃除用具</SelectItem>
                  <SelectItem value="消臭剤">消臭剤</SelectItem>
                  <SelectItem value="ヘアカラー剤">ヘアカラー剤</SelectItem>
                  <SelectItem value="美容液、ファンデーション">美容液、ファンデーション</SelectItem>
                  <SelectItem value="医薬品">医薬品</SelectItem>
                  <SelectItem value="キッチンペーパー">キッチンペーパー</SelectItem>
                  <SelectItem value="オールインワンクリーム">オールインワンクリーム</SelectItem>
                  <SelectItem value="オールインワン">オールインワン</SelectItem>
                  <SelectItem value="寝具">寝具</SelectItem>
                  <SelectItem value="シャンプー＆コンディショナー">シャンプー＆コンディショナー</SelectItem>
                  <SelectItem value="サプリメント">サプリメント</SelectItem>
                  <SelectItem value="化粧水＆乳液">化粧水＆乳液</SelectItem>
                  <SelectItem value="乳液">乳液</SelectItem>
                  <SelectItem value="エアウォレット">エアウォレット</SelectItem>
                  <SelectItem value="シミ予防クリーム">シミ予防クリーム</SelectItem>
                  <SelectItem value="美顔器">美顔器</SelectItem>
                  <SelectItem value="リップ、アイシャドウ">リップ、アイシャドウ</SelectItem>
                  <SelectItem value="美容液、クレンジングオイル">美容液、クレンジングオイル</SelectItem>
                  <SelectItem value="マッサージ器">マッサージ器</SelectItem>
                  <SelectItem value="脱毛器">脱毛器</SelectItem>
                  <SelectItem value="シャワーヘッド">シャワーヘッド</SelectItem>
                  <SelectItem value="フィックスミスト">フィックスミスト</SelectItem>
                  <SelectItem value="動画視聴サービス">動画視聴サービス</SelectItem>
                  <SelectItem value="スタリング剤">スタリング剤</SelectItem>
                  <SelectItem value="リキッドアイカラー">リキッドアイカラー</SelectItem>
                  <SelectItem value="ボディケア">ボディケア</SelectItem>
                  <SelectItem value="ラカント">ラカント</SelectItem>
                  <SelectItem value="アイマスク">アイマスク</SelectItem>
                  <SelectItem value="化粧下地">化粧下地</SelectItem>
                  <SelectItem value="ヨーグルト">ヨーグルト</SelectItem>
                  <SelectItem value="産毛ライナー">産毛ライナー</SelectItem>
                </SelectContent>
              </Select>
            </div>


          </div>



          {/* 検索実行ボタン */}
          <div className="flex justify-center mt-6">
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
                          {influencer.name || influencer.アカウント名 || influencer.ハンドル名 || 'Unknown'}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {influencer.realName || influencer.モデルカテゴリ || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPM:</span>
                        <span className="text-white">¥{influencer.CPM?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">単価数値:</span>
                        <span className="text-white">¥{influencer.単価数値?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">媒体:</span>
                        <span className="text-white">{influencer.媒体 || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">目的:</span>
                        <span className="text-white">{influencer.目的 || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">モデルカテゴリ:</span>
                        <span className="text-white">{influencer.モデルカテゴリ || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">商品実績:</span>
                        <span className="text-white">{influencer.商品 || 'N/A'}</span>
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
