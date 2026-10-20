import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productController } from '../controllers/productController';
import { cartController } from '../controllers/cartController';
import SizeGuideModal from '../components/SizeGuideModal';
import Entypo from '@expo/vector-icons/Entypo';
import FloatingNavBar from '../components/FloatingNavBar';

export default function ProductDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { productId } = route.params || { productId: 'p1' };
  
  // Lấy dữ liệu sản phẩm qua controller
  const product = productController.getProductDetails(productId);

  // Khởi tạo ban đầu CHƯA chọn size nào
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  // State quản lý Toast, Modal giỏ hàng và cảnh báo lỗi chưa chọn size
  const [showToast, setShowToast] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);

  // Ref để cuộn ScrollView lên vị trí chọn size
  const scrollViewRef = useRef<ScrollView>(null);

  // State lưu trữ giỏ hàng hiện tại
  const [cartState, setCartState] = useState<any>({ items: [] });
  
  // Trạng thái mở/đóng (Accordion) cho các mục
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    amortization: true,
    characteristics: true,
    technology: false,
    reviews: false,
    questions: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Cập nhật trạng thái giỏ hàng từ cartController.getCartState()
  const refreshCart = () => {
    try {
      const currentCart = cartController.getCartState();
      setCartState(currentCart || { items: [] });
    } catch (e) {
      setCartState({ items: [] });
    }
  };

  useEffect(() => {
    refreshCart();
  }, [showToast, showCartModal]);

  // Tự động tắt Toast thông báo sau 5 giây
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>Товар не найден</Text>
      </SafeAreaView>
    );
  }

  // --- LẤY DANH SÁCH SIZE ĐỘNG TỪ PRODUCT CONTROLLER ---
  const rawSizes = product.sizes || ['38', '39', '40', '41', '42']; 
  const currentSizes = rawSizes.map((item: any) => {
    if (typeof item === 'object' && item !== null) {
      return { size: String(item.size || ''), cm: String(item.cm || '') };
    }
    return { size: String(item), cm: '' };
  });

  // Danh sách các sản phẩm đang có trong giỏ hàng
  const cartItems = cartState?.items || [];

  // Tìm sản phẩm hiện tại trong giỏ hàng theo ID và Size
  const cartItem = selectedSize ? cartItems.find(
    (item: any) => item?.product?.id === product.id && item?.selectedSize === selectedSize
  ) : null;
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // Tính tổng số lượng hiển thị trên FloatingNavBar
  const totalCartCount = cartItems.reduce((sum: number, item: any) => sum + (item?.quantity || 0), 0);

  // Lấy danh sách sản phẩm mua kèm thường xuyên từ data thông qua productController[cite: 8, 9]
  const frequentlyBoughtProducts = productController.getProducts({});

  // Xử lý khi bấm nút "В корзину" qua cartController
  const handleAddToCart = () => {
    // Nếu chưa chọn size -> Bật lỗi và cuộn màn hình lên vùng chọn size
    if (!selectedSize) {
      setShowSizeError(true);
      scrollViewRef.current?.scrollTo({ y: 450, animated: true });
      return;
    }

    // Nếu đã chọn size -> Gọi cartController để thêm vào giỏ hàng
    setShowSizeError(false);
    cartController.addProductToCart(product, 1, selectedSize);
    refreshCart();
    setShowToast(true);
    setShowCartModal(true);
  };

  // Thay đổi số lượng qua nút + / - ở thanh đáy
  const handleUpdateQuantity = (newQty: number) => {
    if (!cartItem) return;
    if (newQty <= 0) {
      cartController.removeItem(cartItem.id);
    } else {
      cartController.changeItemQuantity(cartItem.id, newQty);
    }
    refreshCart();
  };

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.images?.[0] }} style={styles.mainImage} />
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
              <Ionicons name="information-circle-outline" size={16} color="#ffffff" />
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>{product.price} ₽</Text>
              {product.oldPrice && <Text style={styles.oldPrice}>{product.oldPrice} ₽</Text>}
            </View>
          </View>

          {/* TOAST THÔNG BÁO THÀNH CÔNG */}
          {showToast && (
            <View style={styles.toastBanner}>
              <Text style={styles.toastBannerText}>Товар добавлен в корзину</Text>
            </View>
          )}

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

          {/* Size Selector Header */}
          <View style={styles.sizeSectionHeader}>
            <Text style={[styles.sizeSectionTitle, showSizeError && { color: '#ff3b30' }]}>
              {showSizeError ? 'Пожалуйста, выберите размер!' : 'Выберите размер (RUS)'}
            </Text>
            <TouchableOpacity onPress={() => setShowSizeGuide(true)}>
              <Text style={styles.sizeGuideLink}>Таблица размеров</Text>
            </TouchableOpacity>
          </View>

          {/* Size List lấy từ sản phẩm */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeRow}>
            {currentSizes.map((item) => {
              const isSelected = selectedSize === item.size;
              return (
                <TouchableOpacity
                  key={item.size}
                  style={[
                    styles.sizeChip, 
                    isSelected && styles.selectedSizeChip,
                    showSizeError && !selectedSize && styles.errorSizeChip
                  ]}
                  onPress={() => {
                    setSelectedSize(item.size);
                    setShowSizeError(false);
                  }}
                >
                  <Text style={[styles.sizeText, isSelected && styles.selectedSizeText]}>
                    {item.size}
                  </Text>
                  {item.cm ? (
                    <Text style={[styles.sizeSubText, isSelected && styles.selectedSubText]}>
                      {item.cm} см
                    </Text>
                  ) : null}
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
            <Text style={styles.stockNoticeText}>
              {selectedSize ? `Выбран размер: ${selectedSize}` : 'Для отображения наличия выберите размер'}
            </Text>
          </View>

          {/* --- ACCORDION SECTIONS --- */}
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
              {product.description}
            </Text>
          )}

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

          <View style={styles.sectionDivider} />
          <TouchableOpacity 
            style={styles.accordionHeader} 
            onPress={() => toggleSection('questions')}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionTitle}>Вопросы о товаре</Text>
            <Ionicons 
              name={expandedSections.questions ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#111" 
            />
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Vùng chứa cố định ở đáy */}
      <View style={styles.footerContainer}>
        <View style={styles.floatingPricePill}>
          {currentQuantity > 0 ? (
            <View style={styles.addedStateRow}>
              <View style={styles.quantityCounter}>
                <TouchableOpacity 
                  style={styles.qtyBtn} 
                  onPress={() => handleUpdateQuantity(currentQuantity - 1)}
                >
                  <Text style={styles.qtyBtnText}>—</Text>
                </TouchableOpacity>

                <Text style={styles.quantityText}>{currentQuantity}</Text>

                <TouchableOpacity 
                  style={styles.qtyBtn} 
                  onPress={() => handleUpdateQuantity(currentQuantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.goToCartBtn} 
                onPress={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
              >
                <Text style={styles.goToCartText}>Перейти в корзину</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View>
                {product.oldPrice && <Text style={styles.pillOldPrice}>{product.oldPrice} ₽</Text>}
                <Text style={styles.pillPrice}>{product.price} ₽</Text>
              </View>
              <TouchableOpacity style={styles.pillAddToCartBtn} onPress={handleAddToCart}>
                <Text style={styles.pillAddToCartText}>В корзину</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Modal Bảng kích cỡ */}
      <SizeGuideModal visible={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
          <FloatingNavBar
      activeTab="Каталог"
      cartCount={totalCartCount}
      onTabPress={(tabName) => {
        if (tabName === 'Главная') navigation.navigate('MainTabs', { screen: 'HomeTab' });
        if (tabName === 'Каталог') navigation.navigate('MainTabs', { screen: 'CatelogyTab' });
        if (tabName === 'Сервисы') navigation.navigate('MainTabs', { screen: 'ServicesTab' });
        if (tabName === 'Корзина') navigation.navigate('MainTabs', { screen: 'CartTab' });
        if (tabName === 'Профиль') navigation.navigate('MainTabs', { screen: 'ProfileTab' });
      }}
      onStorePress={() => {}}
    />
      {/* MODAL GỢI Ý SẢN PHẨM MUA KÈM (Lấy dữ liệu động từ controller) */}
      {showCartModal && (
        <View style={styles.cartModalOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowCartModal(false)}>
            <View style={styles.modalBackdropTouch} />
          </TouchableWithoutFeedback>

          <View style={styles.cartModalContent}>
            <TouchableOpacity onPress={() => setShowCartModal(false)} style={{ alignItems: 'center', width: '100%' }}>
              <View style={styles.modalHandleBar} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>С этим товаром часто покупают</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContainer}>
              {frequentlyBoughtProducts.map((p) => (
                <View key={p.id} style={styles.productCard}>
                  <View style={styles.productImageWrapper}>
                    <Image source={{ uri: p.images?.[0] }} style={styles.productImg} />
                    <View style={styles.floatingActions}>
                      <TouchableOpacity style={styles.actionIconBtn}>
                        <Ionicons name="heart-outline" size={16} color="#666" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionIconBtn}>
                        <Ionicons name="scale-outline" size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.productDetailsRow}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>{p.price} ₽</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        {p.oldPrice && <Text style={styles.productOldPrice}>{p.oldPrice} ₽</Text>}
                        {p.discount && <Text style={styles.productDiscount}>{p.discount}</Text>}
                      </View>
                      <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                      <Text style={styles.ratingText}><Text style={{ color: '#086ee7' }}>★</Text> {p.rating || '4.5'}</Text>
                    </View>

                    <TouchableOpacity style={styles.blueCartBtn}>
                      <Ionicons name="cart-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.continueShoppingBtn} 
              onPress={() => setShowCartModal(false)}
            >
              <Text style={styles.continueShoppingText}>Продолжить покупки</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  
  toastBanner: {
    backgroundColor: '#1c2230',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
  toastBannerText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },

  bonusInfoBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f4f6f8', padding: 14, borderRadius: 16, marginBottom: 12 },
  bonusInfoText: { fontSize: 14, fontWeight: '600', color: '#111' },
  splayBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f6f8', padding: 14, borderRadius: 16, marginBottom: 20, gap: 8 },
  splayBold: { backgroundColor: '#111', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  splayText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  sizeSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sizeSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  sizeGuideLink: { fontSize: 13, color: '#005bff', fontWeight: '600' },
  sizeRow: { flexDirection: 'row', marginBottom: 12 },
  sizeChip: { width: 68, height: 56, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, marginRight: 8 },
  selectedSizeChip: { borderColor: '#005bff', backgroundColor: '#eef3ff' },
  errorSizeChip: { borderColor: '#ff3b30', borderWidth: 1.5 },
  sizeText: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  selectedSizeText: { color: '#005bff' },
  sizeSubText: { fontSize: 14, color: '#888', marginTop: 2 },
  selectedSubText: { color: '#005bff' },
  measureLinkRow: { marginBottom: 16 },
  measureLinkText: { fontSize: 13, color: '#005bff', fontWeight: '600' },
  stockNoticeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e7eceb75', padding: 18, borderRadius: 16, marginBottom: 20 },
  stockNoticeText: { fontSize: 16, color: '#787a7d', marginHorizontal: 10 },
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

  footerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  floatingPricePill: {
    width: '80%',
    backgroundColor: '#171d31',
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
  pillOldPrice: { fontSize: 14, color: '#8b92a5', textDecorationLine: 'line-through', marginBottom: -2 },
  pillPrice: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  pillAddToCartBtn: { backgroundColor: '#005bff', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 12 },
  pillAddToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  addedStateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  quantityCounter: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 8 },
  qtyBtn: { padding: 6 },
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  quantityText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  goToCartBtn: { backgroundColor: '#005bff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  goToCartText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  cartModalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.45)', justifyContent: 'flex-end', zIndex: 2000 },
  modalBackdropTouch: { flex: 1 },
  cartModalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 28, height: '65%' },
  modalHandleBar: { width: 40, height: 4, backgroundColor: '#d1d1d6', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 24, fontWeight: '500', color: '#111', marginBottom: 16 },
  horizontalScrollContainer: { gap: 12, paddingBottom: 8 },

  productCard: { width: 180, backgroundColor: '#fff', borderRadius: 16 },
  productImageWrapper: { width: '100%', height: 230, backgroundColor: '#f6f6f8', borderRadius: 16, overflow: 'hidden', position: 'relative' },
  productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  floatingActions: { position: 'absolute', top: 10, right: 10, gap: 6 },
  actionIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  productDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productPrice: { fontSize: 18, fontWeight: 'bold', color: '#086ee7' },
  productOldPrice: { fontSize: 14, color: '#888', textDecorationLine: 'line-through' },
  productDiscount: { fontSize: 14, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 17, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  ratingText: { fontSize: 15, color: '#666', marginTop: 2 },
  blueCartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center' },

  continueShoppingBtn: { backgroundColor: '#eef3ff', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  continueShoppingText: { color: '#005bff', fontSize: 20, fontWeight: '600' },
});