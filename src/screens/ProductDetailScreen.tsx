import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { productController } from '../controllers/productController';
import { useCart } from '../hooks/useCart';
import { Product } from '../models';
import { ProductAccordion } from '../components/ProductAccordion';

export default function ProductDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { productId } = route.params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [specs, setSpecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [adding, setAdding] = useState(false);

  // 1. Gọi API lấy chi tiết sản phẩm và thông số kỹ thuật
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, specsData] = await Promise.all([
          productController.getDetail(productId),
          productController.getSpecs(productId)
        ]);
        setProduct(productData);
        setSpecs(specsData);
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

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setAdding(true);

    try {
      await addToCart(productId, selectedSize, selectedColor, 1);
      alert('Товар добавлен в корзину');
    } catch (error: any) {
      alert(error.message); // Báo lỗi tiếng Nga (VD: OUT_OF_STOCK)
    } finally {
      setAdding(false);
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
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

          {/* Chọn màu */}
          {product.colors && product.colors.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Цвет: {product.colors.find(c => c.colorID === selectedColor)?.name}</Text>
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

          {/* Khối Mô tả / Thông số */}
          <ProductAccordion product={product} specs={specs} />
        </View>
      </ScrollView>

      {/* Footer Thanh toán */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerPrice}>{finalPrice} ₽</Text>
          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart} disabled={adding}>
            {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.addToCartText}>В корзину</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBar: { padding: 16 },
  imageContainer: { width: '100%', height: 400, backgroundColor: '#f6f6f8' },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  contentPadding: { padding: 16 },
  brandTitle: { fontSize: 22, fontWeight: '900', fontStyle: 'italic', marginBottom: 4 },
  productTitle: { fontSize: 18, fontWeight: '500', color: '#333', marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 20 },
  currentPrice: { fontSize: 26, fontWeight: 'bold', color: '#111' },
  oldPrice: { fontSize: 16, textDecorationLine: 'line-through', color: '#888' },
  discountBadge: { fontSize: 14, fontWeight: 'bold', color: '#ff3b30' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorChip: { paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  sizeChip: { width: 60, height: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 10 },
  selectedChip: { borderColor: '#005bff', backgroundColor: '#eef3ff' },
  selectedChipText: { color: '#005bff', fontWeight: 'bold' },
  chipText: { fontSize: 16, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  footerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerPrice: { fontSize: 24, fontWeight: 'bold' },
  addToCartBtn: { backgroundColor: '#005bff', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 12, minWidth: 150, alignItems: 'center' },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});