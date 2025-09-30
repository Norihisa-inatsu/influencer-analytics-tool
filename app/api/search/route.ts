import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ルートの実行環境を Node.js に固定（Edge ではなく）
export const runtime = 'nodejs'
// 常に最新を取得（キャッシュ無効）
export const revalidate = 0

export async function GET(request: Request) {
  console.log('Search API Route: GET request received');
  
  try {
    // フロントエンドから送られてきた検索パラメータを取得
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('searchQuery');
    const selectedCategories = searchParams.get('selectedCategories');
    const selectedMedia = searchParams.get('selectedMedia');
    const selectedObjective = searchParams.get('selectedObjective');
    const cpmRange = searchParams.get('cpmRange');
    const priceRange = searchParams.get('priceRange');
    
    console.log('Search API Route: 検索パラメータ:', {
      searchQuery,
      selectedCategories,
      selectedMedia,
      selectedObjective,
      cpmRange,
      priceRange
    });

    // 媒体ごとの参照ビューを決定
    const mediaToView: Record<string, string> = {
      TikTok: 'v_tiktok_raw_data',
      Instagram: 'v_instagram_raw_data',
      X: 'v_x_raw_data'
    };

    // 既定は casfeed だが、selectedMedia が特定媒体ならビューを使う
    const table = selectedMedia && selectedMedia !== 'all'
      ? mediaToView[selectedMedia] || 'casfeed'
      : 'casfeed';

    // Supabaseクエリの構築
    let query = supabase
      .from(table)
      .select('*');

    // 検索クエリによる絞り込み（複数カラムを横断検索）
    if (searchQuery && searchQuery.trim() !== '') {
      const searchTerms = searchQuery.trim().split(/\s+/);
      const like = (term: string) =>
        selectedMedia && selectedMedia !== 'all'
          ? `product_genre.ilike.%${term}%,product.ilike.%${term}%,model_category.ilike.%${term}%,account_name.ilike.%${term}%,handle_name.ilike.%${term}%,objective.ilike.%${term}%`
          : `商材ジャンル.ilike.%${term}%,商品.ilike.%${term}%,モデルカテゴリ.ilike.%${term}%,媒体.ilike.%${term}%,目的.ilike.%${term}%`;
      searchTerms.forEach(term => {
        query = query.or(like(term));
      });
    }

    // カテゴリフィルター
    if (selectedCategories && selectedCategories !== '') {
      const categories = selectedCategories.split(',').filter(cat => cat.trim() !== '');
      if (categories.length > 0) {
        if (selectedMedia && selectedMedia !== 'all') {
          query = query.in('model_category', categories);
        } else {
          query = query.in('モデルカテゴリ', categories);
        }
      }
    }

    // 媒体フィルター（casfeed のみ必要。ビューは媒体固定のため不要）
    if ((!selectedMedia || selectedMedia === 'all') && selectedMedia !== '' ) {
      // casfeed を参照する場合のみ媒体で絞り込み
      if (selectedMedia && selectedMedia !== 'all') {
        query = query.eq('媒体', selectedMedia);
      }
    }

    // 目的フィルター
    if (selectedObjective && selectedObjective !== '' && selectedObjective !== 'all') {
      if (selectedMedia && selectedMedia !== 'all') {
        query = query.eq('objective', selectedObjective);
      } else {
        query = query.eq('目的', selectedObjective);
      }
    }

    // CPM範囲フィルター
    if (cpmRange && cpmRange !== '') {
      try {
        const [minCpm, maxCpm] = JSON.parse(cpmRange);
        if (typeof minCpm === 'number' && typeof maxCpm === 'number') {
          query = query.gte('CPM', minCpm).lte('CPM', maxCpm);
        }
      } catch (e) {
        console.warn('CPM範囲のパースに失敗:', e);
      }
    }

    // 単価数値範囲フィルター
    if (priceRange && priceRange !== '') {
      try {
        const [minPrice, maxPrice] = JSON.parse(priceRange);
        if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
          query = query.gte('単価数値', minPrice).lte('単価数値', maxPrice);
        }
      } catch (e) {
        console.warn('単価範囲のパースに失敗:', e);
      }
    }

    console.log('Search API Route: Supabaseクエリ実行開始 - table =', table);

    // Supabaseクエリを実行
    const { data, error } = await query;

    if (error) {
      console.error('Search API Route: Supabaseエラー:', error);
      return NextResponse.json(
        { error: 'データベースエラー', details: error.message },
        { status: 500 }
      );
    }

    console.log('Search API Route: 検索結果件数:', data?.length || 0);

    // 検索結果をフロントエンドに返す
    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      searchParams: {
        searchQuery,
        selectedCategories,
        selectedMedia,
        selectedObjective,
        cpmRange,
        priceRange
      }
    });

  } catch (error) {
    console.error('Search API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
