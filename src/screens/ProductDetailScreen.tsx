import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productController } from '../controllers/productController';
import { cartController } from '../controllers/cartController';
import FloatingNavBar from '../components/FloatingNavBar';
import SizeGuideModal from '../components/SizeGuideModal';
import Entypo from '@expo/vector-icons/Entypo';
export default function ProductDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { productId } = route.params || { productId: 'p1' };
  const product = productController.getProductDetails(productId);

  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : '39.5');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  // Trạng thái mở/đóng (Accordion) cho các mục tiêu đề
  const [expandedSections, setExpandedSections] = useState({
    characteristics: true,
    technology: false,
    reviews: false,
    questions: false,
    amortization:false,
    description:false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>Товар не найден</Text>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    cartController.addProductToCart(product, 1, selectedSize);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };
  // State quản lý tab size đang chọn (RUS, EUR, US, UK)
  const [selectedTab, setSelectedTab] = useState<'RUS' | 'EUR' | 'US' | 'UK'>('RUS');

  // Dữ liệu bảng quy đổi chi tiết tương ứng cho từng loại size
  const sizeMapping: Record<string, { size: string; cm: string }[]> = {
    RUS: [
      { size: '38', cm: '24.5' },
      { size: '39', cm: '25' },
      { size: '39.5', cm: '25.5' },
      { size: '40', cm: '26' },
      { size: '41', cm: '26.5' },
      { size: '41.5', cm: '27.5' },
      { size: '42', cm: '28' },
    ],
    EUR: [
      { size: '38.5', cm: '24.5' },
      { size: '39', cm: '25' },
      { size: '40', cm: '25.5' },
      { size: '40.5', cm: '26' },
      { size: '41.5', cm: '26.5' },
      { size: '42.5', cm: '27.5' },
      { size: '43', cm: '28' },
    ],
    US: [
      { size: '6.5', cm: '24.5' },
      { size: '7', cm: '25' },
      { size: '7.5', cm: '25.5' },
      { size: '8', cm: '26' },
      { size: '8.5', cm: '26.5' },
      { size: '9.5', cm: '27.5' },
      { size: '10', cm: '28' },
    ],
    UK: [
      { size: '5.5', cm: '24.5' },
      { size: '6', cm: '25' },
      { size: '6.5', cm: '25.5' },
      { size: '7', cm: '26' },
      { size: '7.5', cm: '26.5' },
      { size: '8.5', cm: '27.5' },
      { size: '9', cm: '28' },
    ],
  };

  // Lấy danh sách size hiện tại dựa vào tab đang chọn
  const currentSizes = sizeMapping[selectedTab] || sizeMapping['RUS'];
  return (
    <SafeAreaView style={styles.container} >
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn}><Ionicons name="notifications-outline" size={20} color="#111" /></TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}><Ionicons name="share-social-outline" size={20} color="#111" /></TouchableOpacity>
        </View>
      </View>

      {/* Tăng paddingBottom để nội dung không bị che bởi thanh giá và FloatingNavBar */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.images[0] }} style={styles.mainImage} />
          <View style={styles.imageTagRow}>
            <View style={styles.tagWear}><Text style={styles.tagTextWhite}>С чем носить</Text></View>
            <View style={styles.tagSimilar}><Text style={styles.tagTextDark}>Похожие</Text></View>
          </View>
        </View>

        <View style={styles.contentPadding}>
          {/* Badge & Promo Row */}
          <View style={styles.promoRow}>
            {product.discount && <View style={styles.redDiscountBadge}><Text style={styles.redBadgeText}>{product.discount}</Text></View>}
            <Text style={styles.onlyUsText}>Только у нас</Text>
            <Text style={styles.honestSignText}>Честный знак</Text>
          </View>

          {/* Video banner button */}
          <TouchableOpacity style={styles.videoButton} activeOpacity={0.8}>
            <Ionicons name="play-circle-outline" size={20} color="#005bff" style={{ marginRight: 6 }} />
            <Text style={styles.videoButtonText}>Смотреть видео</Text>
          </TouchableOpacity>

          {/* Brand & Rating */}
          <View style={styles.brandRatingRow}>
            <Text style={styles.brandTitle}>{product.brandId || 'PUMA'}</Text>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingScore}>{product.rating || '4.3'}</Text>
              <Text style={styles.reviewsCount}>(3 412)</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Personal Price Card */}
          <View style={styles.personalPriceCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.personalLabel}>Персональная цена</Text>
              <Ionicons name="information-circle-outline" size={16} color="#005bff" />
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>{product.price} ₽</Text>
              {product.oldPrice && <Text style={styles.oldPrice}>{product.oldPrice} ₽</Text>}
            </View>
          </View>

          {/* Bonus Info Bar */}
          <View style={styles.bonusInfoBox}>
            <Text style={styles.bonusInfoText}>🟡 Начислим от 300 бонусов</Text>
            <Ionicons name="chevron-forward" size={16} color="#888" />
          </View>

          {/* Splay Pay Bar */}
          <View style={styles.splayBox}>
            <Text style={styles.splayBold}>CПЛИТ</Text>
            <Text style={styles.splayText}>4 платежа по 1 550 ₽</Text>
            <Ionicons name="chevron-forward" size={16} color="#888" />
          </View>

          {/* Size Selector Header (Tab chuyển đổi RUS, EUR, US, UK) */}
          <View style={styles.sizeSectionHeader}>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {(['RUS', 'EUR', 'US', 'UK'] as const).map((tab) => {
                const isActive = selectedTab === tab;
                return (
                  <TouchableOpacity 
                    key={tab} 
                    onPress={() => {
                      setSelectedTab(tab);
                      // Tự động chọn phần tử đầu tiên của tab mới làm mặc định
                      setSelectedSize(sizeMapping[tab][0].size);
                    }}
                  >
                    <Text style={[styles.sizeTabInactive, isActive && styles.sizeTabActive]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity onPress={() => setShowSizeGuide(true)}>
              <Text style={styles.sizeGuideLink}>Таблица размеров</Text>
            </TouchableOpacity>
          </View>

          {/* Danh sách các chip size hiển thị theo tab đã chọn */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeRow}>
            {currentSizes.map((item) => {
              const isSelected = selectedSize === item.size;
              return (
                <TouchableOpacity
                  key={item.size}
                  style={[styles.sizeChip, isSelected && styles.selectedSizeChip]}
                  onPress={() => setSelectedSize(item.size)}
                >
                  <Text style={[styles.sizeText, isSelected && styles.selectedSizeText]}>
                    {item.size}
                  </Text>
                  <Text style={[styles.sizeSubText, isSelected && styles.selectedSubText]}>
                    {item.cm} см
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.measureLinkRow}>
            <Text style={styles.measureLinkText}>Как узнать длину стопы?</Text>
          </TouchableOpacity>

          {/* Stock Notice Box */}
          <View style={styles.stockNoticeBox}>
            <Entypo name="ruler" size={18} color="#bcbec1" style={{ marginRight: 8 }} />
            <Text style={styles.stockNoticeText}>Для отображения наличия выберите размер</Text>
          </View>

          {/* --- CÁC MỤC THÔNG TIN CHI TIẾT --- */}
          
          {/* 1. Описание (Accordion) */}
          <View style={styles.sectionDivider} />
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => toggleSection('description')}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>Описание</Text>
            <Ionicons 
              name={expandedSections.description ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#111" 
            />
          </TouchableOpacity>
          {expandedSections.description && (
            <Text style={styles.sectionBodyText}>
              {product.description || 'Классический силуэт кроссовок ST Runner v3, дополненный функциональной отделкой задника, не оставит равнодушным истинного ценителя спортивного стиля.'}
            </Text>
          )}

          {/* 2. Амортизация (Accordion) */}
          <View style={styles.sectionDivider} />
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => toggleSection('amortization')}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>Амортизация</Text>
            <Ionicons 
              name={expandedSections.amortization ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#111" 
            />
          </TouchableOpacity>
          {expandedSections.amortization && (
            <View>
              <Text style={styles.sectionBodyText}>
                Упругая стелька из материала SoftFoam+ эффективно гасит ударные нагрузки.
              </Text>
              <TouchableOpacity style={styles.showMoreBtn}>
                <Text style={styles.showMoreText}>Показать полностью</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 3. Характеристики */}
          <View style={styles.sectionDivider} />
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => toggleSection('characteristics')}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>Характеристики</Text>
            <Ionicons 
              name={expandedSections.characteristics ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#111" 
            />
          </TouchableOpacity>

          {expandedSections.characteristics && (
            <View style={styles.accordionContent}>
              <View style={styles.charRow}>
                <Text style={styles.subGroupTitle}>Артикул</Text>
                <Text style={styles.charValueLink}>Штрихкод</Text>
              </View>
              <Text style={styles.skuText}>{product.id || '384855MPOP-04-7'}</Text>
              
              <Text style={styles.subGroupTitle}>Конструктивные особенности</Text>
              <View style={styles.charRow}><Text style={styles.charLabel}>Полнота</Text><Text style={styles.charValue}>Средняя</Text></View>
              <View style={styles.charRow}><Text style={styles.charLabel}>Застежка</Text><Text style={styles.charValue}>Шнуровка</Text></View>

              <Text style={styles.subGroupTitle}>Функциональные особенности</Text>
              <View style={styles.charRow}><Text style={styles.charLabel}>Антибактериальная пропитка</Text><Text style={styles.charValue}>Да</Text></View>
              <View style={styles.charRow}><Text style={styles.charLabel}>Защита от влаги</Text><Text style={styles.charValue}>Отсутствует</Text></View>
            </View>
          )}

          {/* 4. Технологии */}
          <View style={styles.sectionDivider} />
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => toggleSection('technology')}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>Технологии</Text>
            <Ionicons 
              name={expandedSections.technology ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#111" 
            />
          </TouchableOpacity>
          {expandedSections.technology && (
            <Text style={styles.sectionBodyText}>SoftFoam+, IMEVA</Text>
          )}

          {/* 5. Отзывы */}
          <View style={styles.sectionDivider} />
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => toggleSection('reviews')}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>Отзывы</Text>
            <Ionicons 
              name={expandedSections.reviews ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#111" 
            />
          </TouchableOpacity>
          {expandedSections.reviews && (
            <Text style={styles.sectionBodyText}>
              Удобные кроссовки с мягкой амортизирующей стелькой, которые не натирают и снижают нагрузку на суставы при длительной ходьбе...
            </Text>
          )}

          {/* 6. Вопросы о товаре */}
          <View style={styles.sectionDivider} />
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => toggleSection('questions')}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>Вопросы о товаре </Text>
            <Ionicons 
              name={expandedSections.questions ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#111" 
            />
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Vùng chứa cố định ở đáy: Thanh Giá + Nút Thêm vào giỏ nằm ngay TRÊN FloatingNavBar */}
      <View style={styles.footerContainer}>
        <View style={styles.floatingPricePill}>
          <View>
            {product.oldPrice && <Text style={styles.pillOldPrice}>{product.oldPrice} ₽</Text>}
            <Text style={styles.pillPrice}>{product.price} ₽</Text>
          </View>
          <TouchableOpacity style={styles.pillAddToCartBtn} onPress={handleAddToCart}>
            <Text style={styles.pillAddToCartText}>В корзину</Text>
          </TouchableOpacity>
        </View>

        {/* FloatingNavBar tích hợp dưới cùng */}
        <FloatingNavBar 
          activeTab="Главная" 
          onTabPress={(tab) => {
            if (tab === 'Главная') navigation.navigate('HomeTab');
            if (tab === 'Каталог') navigation.navigate('CatalogTab');
            if (tab === 'Сервисы') navigation.navigate('ServicesTab');
            if (tab === 'Корзина') navigation.navigate('CartTab');
            if (tab === 'Профиль') navigation.navigate('ProfileTab');
          }}
          onStorePress={() => {}}
        />
        
      </View>
      <SizeGuideModal visible={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  backBtn: { padding: 4 },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerIconBtn: { padding: 4 },
  imageContainer: { width: '100%', height: 320, backgroundColor: '#f6f6f8', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageTagRow: { position: 'absolute', bottom: 12, flexDirection: 'row', gap: 8 },
  tagWear: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagSimilar: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagTextWhite: { color: '#fff', fontSize: 13, fontWeight: '600' },
  tagTextDark: { color: '#111', fontSize: 13, fontWeight: '600' },
  contentPadding: { padding: 16 },
  promoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  redDiscountBadge: { backgroundColor: '#ff3b30', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  redBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  onlyUsText: { fontSize: 12, color: '#333', fontWeight: '500' },
  honestSignText: { fontSize: 12, color: '#333', fontWeight: '500' },
  videoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef3ff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 14 },
  videoButtonText: { color: '#005bff', fontSize: 14, fontWeight: '600' },
  brandRatingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  brandTitle: { fontSize: 20, fontWeight: '900', fontStyle: 'italic', color: '#111' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingStar: { color: '#005bff', fontSize: 14 },
  ratingScore: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  reviewsCount: { fontSize: 13, color: '#888' },
  productTitle: { fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 16 },
  personalPriceCard: { backgroundColor: '#005bff', padding: 14, borderRadius: 16, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  personalLabel: { fontSize: 18, color: '#ffffff', fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  currentPrice: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  oldPrice: { fontSize: 16, color: '#d2cdcd', textDecorationLine: 'line-through' },
  bonusInfoBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f4f6f8', padding: 14, borderRadius: 16, marginBottom: 12 },
  bonusInfoText: { fontSize: 14, fontWeight: '600', color: '#111' },
  splayBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f6f8', padding: 14, borderRadius: 16, marginBottom: 20, gap: 8 },
  splayBold: { backgroundColor: '#111', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  splayText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  sizeSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sizeTabActive: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  sizeTabInactive: { fontSize: 16, fontWeight: 'bold', color: '#aaa' },
  sizeGuideLink: { fontSize: 13, color: '#005bff', fontWeight: '600' },
  sizeRow: { flexDirection: 'row', marginBottom: 12 },
  sizeChip: { width: 68, height: 56, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, marginRight: 8 },
  selectedSizeChip: { borderColor: '#005bff', backgroundColor: '#eef3ff' },
  sizeText: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  selectedSizeText: { color: '#005bff' },
  sizeSubText: { fontSize: 14, color: '#888', marginTop: 2 },
  selectedSubText: { color: '#005bff' },
  measureLinkRow: { marginBottom: 16 },
  measureLinkText: { fontSize: 13, color: '#005bff', fontWeight: '600' },
  stockNoticeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e7eceb75', padding: 18, borderRadius: 16, marginBottom: 20 },
  stockNoticeText: { fontSize: 18, color: '#787a7d', marginHorizontal:20},
  sectionDivider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  
  sectionTitle: { fontSize: 24, fontWeight: '600', color: '#111', marginBottom: 8 },
  sectionBodyText: { fontSize: 18, color: '#444', lineHeight: 24 },
  showMoreBtn: { marginTop: 10 },
  showMoreText: { fontSize: 14, color: '#005bff', fontWeight: '600' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  accordionContent: { marginTop: 10 },
  charRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  charLabel: { fontSize: 16, color: '#666' },
  charValue: { fontSize: 16, fontWeight: '600', color: '#111' },
  charValueLink: { fontSize: 14, fontWeight: '600', color: '#005bff' },
  skuText: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 10 },
  subGroupTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 12, marginBottom: 6 },

  reviewSnippet: { fontSize: 13, color: '#555', lineHeight: 18, marginTop: 6 },

  /* Cố định cụm đáy: Thanh giá nằm ngay trên FloatingNavBar */
  footerContainer: {
    position: 'absolute',
    bottom: 20, // Cách mép dưới màn hình 20px
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent', // Hoàn toàn trong suốt
    zIndex: 999,
  },
  floatingPricePill: {
    width: '80%', // Thuộc tính màn hình ngang trừ lề
    backgroundColor: '#171d31', // Màu nền tối đặc trưng của Sportmaster
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 120,
    
  },
  pillOldPrice: { 
    fontSize: 14, 
    color: '#8b92a5', 
    textDecorationLine: 'line-through',
    marginBottom: -2,
  },
  pillPrice: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  pillAddToCartBtn: { 
    backgroundColor: '#005bff', 
    paddingVertical: 12, 
    paddingHorizontal: 40, 
    borderRadius: 12 
  },
  pillAddToCartText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});