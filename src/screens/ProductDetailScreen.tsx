import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { productController } from '../controllers/productController';
import { useCart } from '../hooks/useCart';
import { useFloatingNav } from '../hooks/useFloatingNav';
import { Product } from '../models';
import { ProductAccordion } from '../components/ProductAccordion';
import FloatingNavBar from '../components/FloatingNavBar';

export default function ProductDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const floatingNav = useFloatingNav(navigation); // Lấy hook điều hướng

  const [product, setProduct] = useState<Product | null>(null);
  const [specs, setSpecs] = useState<any[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([]); // Sản phẩm mua kèm
  
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  
  // State cho Toast và Modal
  const [showToast, setShowToast] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  // Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, specsData, relatedData] = await Promise.all([
          productController.getDetail(productId),
          productController.getSpecs(productId),
          productController.getRelated(productId, 5) // Lấy sản phẩm mua kèm
        ]);
        setProduct(productData);
        setSpecs(specsData);
        setFrequentlyBought(relatedData);
        
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].colorID);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  // Tự động tắt Toast sau 3 giây
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setAdding(true);

    try {
      await addToCart(productId, selectedSize, selectedColor, 1);
      
      // Hiển thị thông báo thành công và mở Modal mua kèm
      setShowToast(true);
      setShowCartModal(true);
    } catch (error: any) {
      alert(error.message); 
    } finally {
      setAdding(false);
    }
  };

  const handleQuickAdd = async (item: Product) => {
    const size = item.sizes?.[0]?.sizeID;
    if (!size) return alert('Нет в наличии');
    try {
      await addToCart(item.id, size, item.colors?.[0]?.colorID || null, 1);
      setShowToast(true); // Cập nhật lại Toast nếu muốn
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  if (!product) return <Text style={{ textAlign: 'center', marginTop: 40 }}>Товар не найден</Text>;

  const finalPrice = product.newPrice || product.price;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Ảnh sản phẩm */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.mainImage} />
        </View>

        <View style={styles.contentPadding}>
          <Text style={styles.brandTitle}>{product.brandName}</Text>
          <Text style={styles.productTitle}>{product.productName}</Text>

          {/* Giá */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{finalPrice} ₽</Text>
            {product.discount ? <Text style={styles.oldPrice}>{product.price} ₽</Text> : null}
            {product.discount ? <Text style={styles.discountBadge}>-{product.discount}%</Text> : null}
          </View>

          {/* Toast thông báo */}
          {showToast && (
            <View style={styles.toastBanner}>
              <Text style={styles.toastBannerText}>Товар добавлен в корзину</Text>
            </View>
          )}

          {/* Chọn màu */}
          {product.colors && product.colors.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Цвет: {product.colors.find((c: any) => c.colorID === selectedColor)?.name}</Text>
              <View style={styles.chipRow}>
                {product.colors.map((c: any) => (
                  <TouchableOpacity
                    key={c.colorID}
                    style={[styles.colorChip, selectedColor === c.colorID && styles.selectedChip]}
                    onPress={() => setSelectedColor(c.colorID)}
                  >
                    <Text style={[styles.chipText, selectedColor === c.colorID && styles.selectedChipText]}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Chọn size */}
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.sectionTitle, showError && { color: 'red' }]}>
              {showError ? 'Пожалуйста, выберите размер!' : 'Выберите размер (RUS)'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {product.sizes?.map((s: any) => (
                <TouchableOpacity
                  key={s.sizeID}
                  style={[styles.sizeChip, selectedSize === s.sizeID && styles.selectedChip, s.stock === 0 && { opacity: 0.4 }]}
                  disabled={s.stock === 0}
                  onPress={() => { setSelectedSize(s.sizeID); setShowError(false); }}
                >
                  <Text style={[styles.chipText, selectedSize === s.sizeID && styles.selectedChipText]}>{s.size}</Text>
                  {s.stock === 0 && <Text style={{ fontSize: 10, color: 'red' }}>Нет</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ProductAccordion product={product} specs={specs} />
        </View>
      </ScrollView>

      {/* THANH THANH TOÁN NỔI */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerPrice}>{finalPrice} ₽</Text>
          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart} disabled={adding}>
            {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.addToCartText}>В корзину</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* THANH ĐIỀU HƯỚNG FLOATING BAR */}
      <FloatingNavBar activeTab="Каталог" {...floatingNav} />

      {/* MODAL BOTTOM SHEET GỢI Ý MUA KÈM */}
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
              {frequentlyBought.map((p) => (
                <View key={p.id} style={styles.productCard}>
                  <View style={styles.productImageWrapper}>
                    <Image source={{ uri: p.imageUrl }} style={styles.productImg} />
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
                        <Text style={styles.productPrice}>{p.newPrice || p.price} ₽</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        {p.discount ? <Text style={styles.productDiscount}>-{p.discount}%</Text> : null}
                      </View>
                      <Text style={styles.productName} numberOfLines={2}>{p.productName}</Text>
                      <Text style={styles.ratingText}><Text style={{ color: '#086ee7' }}>★</Text> {p.avgRating || '4.5'} ({p.reviewCount || 0})</Text>
                    </View>

                    <TouchableOpacity style={styles.blueCartBtn} onPress={() => handleQuickAdd(p)}>
                      <Ionicons name="cart-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.continueShoppingBtn} onPress={() => setShowCartModal(false)}>
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
  headerBar: { padding: 16, paddingTop: 30 },
  imageContainer: { width: '100%', height: 400, backgroundColor: '#f6f6f8' },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  contentPadding: { padding: 16 },
  brandTitle: { fontSize: 22, fontWeight: '900', fontStyle: 'italic', marginBottom: 4 },
  productTitle: { fontSize: 18, fontWeight: '500', color: '#333', marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 20 },
  currentPrice: { fontSize: 26, fontWeight: 'bold', color: '#111' },
  oldPrice: { fontSize: 16, textDecorationLine: 'line-through', color: '#888' },
  discountBadge: { fontSize: 14, fontWeight: 'bold', color: '#ff3b30' },
  
  // Toast Style
  toastBanner: { backgroundColor: '#1c2230', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 16 },
  toastBannerText: { color: '#ffffff', fontSize: 15, fontWeight: '500' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorChip: { paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  sizeChip: { width: 60, height: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 10 },
  selectedChip: { borderColor: '#005bff', backgroundColor: '#eef3ff' },
  selectedChipText: { color: '#005bff', fontWeight: 'bold' },
  chipText: { fontSize: 16, fontWeight: '500' },
  
  footer: { position: 'absolute', bottom: 120, left: 16, right: 16, backgroundColor: '#171d31', borderRadius: 16, padding: 12,paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
  footerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  footerPrice: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  addToCartBtn: { backgroundColor: '#005bff', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Modal Bottom Sheet Styles
  cartModalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.45)', justifyContent: 'flex-end', zIndex: 2000 },
  modalBackdropTouch: { flex: 1 },
  cartModalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 28, height: '60%' },
  modalHandleBar: { width: 40, height: 4, backgroundColor: '#d1d1d6', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: '500', color: '#111', marginBottom: 16 },
  horizontalScrollContainer: { gap: 12, paddingBottom: 8 },
  productCard: { width: 180, backgroundColor: '#fff', borderRadius: 16 },
  productImageWrapper: { width: '100%', height: 230, backgroundColor: '#f6f6f8', borderRadius: 16, overflow: 'hidden', position: 'relative' },
  productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  floatingActions: { position: 'absolute', top: 10, right: 10, gap: 6 },
  actionIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  productDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productPrice: { fontSize: 18, fontWeight: 'bold', color: '#086ee7' },
  productDiscount: { fontSize: 14, color: '#ff3b30', fontWeight: 'bold' },
  productName: { fontSize: 15, color: '#333', marginTop: 4, height: 36, fontWeight: '500' },
  ratingText: { fontSize: 13, color: '#666', marginTop: 2 },
  blueCartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#005bff', justifyContent: 'center', alignItems: 'center' },
  continueShoppingBtn: { backgroundColor: '#eef3ff', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 20, marginTop: 10 },
  continueShoppingText: { color: '#005bff', fontSize: 18, fontWeight: '600' },
});