<template>
  <q-page padding>
    <!-- Banner -->
    <div
      class="q-mb-md rounded-borders overflow-hidden bg-grey-2"
      style="height: 150px"
    >
      <div class="flex flex-center full-height text-grey">
        <q-icon name="local_florist" size="3em" />
        <div class="q-ml-sm">이번 주 추천 꽃</div>
      </div>
    </div>

    <!-- Category Filter (Dynamic) -->
    <div class="q-mb-md">
      <q-tabs
        v-model="selectedCategory"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
        mobile-arrows
      >
        <q-tab name="ALL" label="전체" />
        <q-tab
          v-for="cat in systemStore.categoryOptions"
          :key="cat.value"
          :name="cat.value"
          :label="cat.label"
        />
      </q-tabs>
    </div>

    <q-infinite-scroll @load="onLoad" :offset="250" ref="infiniteScrollRef">
      <div class="row q-col-gutter-md">
        <div
          v-for="product in products"
          :key="product.id"
          class="col-xs-6 col-sm-4 col-md-3"
        >
          <q-card>
            <q-img
              :src="
                product.thumbnailUrl ||
                'https://cdn.quasar.dev/img/parallax2.jpg'
              "
              :ratio="1"
            />

            <q-card-section>
              <div class="text-h6 ellipsis">{{ product.name }}</div>
              <div class="text-caption text-grey">
                재고: {{ product.stockQuantity }}
              </div>

              <div class="row items-center justify-between q-mt-sm">
                <div class="text-subtitle2 text-red text-weight-bold">
                  {{ product.price.toLocaleString() }}원
                </div>

                <div class="row items-center bg-grey-2 rounded-borders">
                  <q-btn
                    flat
                    round
                    dense
                    icon="remove"
                    size="xs"
                    @click="
                      product.uiQuantity > 1 ? product.uiQuantity-- : null
                    "
                    :disable="product.uiQuantity <= 1"
                  />
                  <div class="q-px-sm text-caption">
                    {{ product.uiQuantity }}
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    icon="add"
                    size="xs"
                    @click="
                      product.uiQuantity < product.stockQuantity
                        ? product.uiQuantity++
                        : null
                    "
                    :disable="product.uiQuantity >= product.stockQuantity"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                v-if="userStore.isAdmin"
                flat
                round
                color="primary"
                icon="add"
                @click="handleRestock(product)"
              >
                <q-tooltip>50개 입고</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="secondary"
                icon="shopping_cart"
                @click="handleAddToCart(product)"
                :disable="product.stockQuantity < 1"
              >
                <q-tooltip>장바구니 담기</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="accent"
                icon="bolt"
                @click="handleDirectOrder(product)"
                :disable="product.stockQuantity < 1"
              >
                <q-tooltip>바로 구매</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>

      <div
        v-if="!isLoading && products.length === 0"
        class="text-center text-grey q-pa-lg"
      >
        상품이 없습니다.
      </div>
    </q-infinite-scroll>

    <!-- 옵션 선택 다이얼로그 -->
    <q-dialog v-model="optionDialog.show">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">{{ optionDialog.product?.name }}</div>
          <div class="text-subtitle2 text-grey">옵션을 선택해주세요</div>
        </q-card-section>

        <q-card-section>
          <!-- 옵션이 있는 경우 -->
          <div
            v-if="
              optionDialog.product?.options &&
              optionDialog.product.options.length > 0
            "
          >
            <div
              v-for="opt in optionDialog.product.options"
              :key="opt.id"
              class="q-mb-sm"
            >
              <q-checkbox
                v-model="optionDialog.selectedOptionIds"
                :val="opt.id"
                :label="`${opt.name}: ${
                  opt.optionValue
                } (+${opt.priceAdjustment.toLocaleString()}원)`"
              />
            </div>
          </div>
          <!-- 옵션이 없는 경우 -->
          <div v-else class="text-center text-grey q-py-md">
            선택 가능한 옵션이 없습니다.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="취소" v-close-popup />
          <q-btn flat label="확인" color="primary" @click="confirmOptions" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <CheckoutDialog
      v-model="showCheckoutDialog"
      @confirm="onDeliveryConfirmed"
    />
    <PaymentDialog v-model="showPaymentDialog" @pay="handlePayment" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/vue-query";
import {
  getProductsPaged,
  restockProduct,
  type Product,
  type ProductWithUI,
} from "src/api/product";
import { createDirectOrder } from "src/api/order";
import { processPayment } from "src/api/payment";
import { useUserStore } from "stores/user-store";
import { useSystemStore } from "stores/system-store";
import { useQuasar } from "quasar";
import PaymentDialog from "components/PaymentDialog.vue";
import CheckoutDialog from "components/CheckoutDialog.vue";
import { useCartStore as useRealCartStore } from "stores/cart-store";

const cartStore = useRealCartStore();
const userStore = useUserStore();
const systemStore = useSystemStore();
const $q = useQuasar();
const queryClient = useQueryClient();

const infiniteScrollRef = ref(null);
const selectedCategory = ref("ALL");

// --- Infinite Query ---
const { data, fetchNextPage, hasNextPage, isLoading, refetch } =
  useInfiniteQuery({
    queryKey: ["products", "infinite", selectedCategory], // Add category to key
    queryFn: ({ pageParam = 0 }) =>
      getProductsPaged({
        page: pageParam as number,
        size: 10,
        // Pass categoryId only if not ALL
        categoryId:
          selectedCategory.value === "ALL" ? undefined : selectedCategory.value,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
  });

// Flatten pages into a single list & add UI state
const products = computed<ProductWithUI[]>(() => {
  return (
    data.value?.pages.flatMap((page) =>
      page.content.map((p) => ({ ...p, uiQuantity: 1 }))
    ) || []
  );
});

// Reset Infinite Scroll when filter changes
watch(selectedCategory, () => {
  // QInfiniteScroll needs to be reset so it can trigger load again
  // But useInfiniteQuery handles data reset via queryKey change
  // We just need to ensure scroll position or component state is ready
  if (infiniteScrollRef.value) {
    (infiniteScrollRef.value as any).resume();
  }
});

const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  try {
    if (hasNextPage.value) {
      await fetchNextPage();
      done();
    } else {
      done(true); // stop scrolling
    }
  } catch (e) {
    done(true);
  }
};

// --- Optimistic Updates (Cart) ---
const cartMutation = useMutation({
  mutationFn: async ({
    product,
    optionIds,
  }: {
    product: ProductWithUI;
    optionIds: number[];
  }) => {
    await cartStore.addItem(product.id, product.uiQuantity, optionIds);
  },
  onMutate: async ({ product }) => {
    $q.notify({
      type: "positive",
      message: "장바구니에 담았습니다 (Optimistic)",
    });
  },
  onError: (err) => {
    $q.notify({ type: "negative", message: "장바구니 담기 실패: 롤백합니다." });
  },
});

// --- State ---
const showPaymentDialog = ref(false);
const showCheckoutDialog = ref(false);
const pendingOrderData = ref<any>(null);
const pendingDeliveryInfo = ref<any>(null);

interface OptionDialogState {
  show: boolean;
  product: ProductWithUI | null;
  actionType: "CART" | "ORDER" | "";
  selectedOptionIds: number[];
}

const optionDialog = ref<OptionDialogState>({
  show: false,
  product: null,
  actionType: "",
  selectedOptionIds: [],
});

const handleRestock = async (product: ProductWithUI) => {
  try {
    await restockProduct(product.id, 50);
    $q.notify({ type: "positive", message: "50개 입고 완료" });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  } catch (e) {
    $q.notify({ type: "negative", message: "입고 실패" });
  }
};

const handleAddToCart = async (product: ProductWithUI) => {
  if (!userStore.isAuthenticated) {
    $q.notify({ type: "warning", message: "로그인이 필요한 기능입니다." });
    return;
  }

  if (product.options && product.options.length > 0) {
    optionDialog.value = {
      show: true,
      product: product,
      actionType: "CART",
      selectedOptionIds: [],
    };
  } else {
    processAddToCart(product, []);
  }
};

const processAddToCart = (product: ProductWithUI, optionIds: number[]) => {
  cartMutation.mutate({ product, optionIds });
};

const handleDirectOrder = async (product: ProductWithUI) => {
  if (!userStore.isAuthenticated) {
    $q.notify({ type: "warning", message: "로그인이 필요한 기능입니다." });
    return;
  }

  if (product.options && product.options.length > 0) {
    optionDialog.value = {
      show: true,
      product: product,
      actionType: "ORDER",
      selectedOptionIds: [],
    };
  } else {
    processDirectOrder(product, []);
  }
};

const processDirectOrder = async (
  product: ProductWithUI,
  optionIds: number[]
) => {
  pendingOrderData.value = {
    productId: product.id,
    quantity: product.uiQuantity,
    optionIds: optionIds,
  };
  showCheckoutDialog.value = true;
};

const onDeliveryConfirmed = (deliveryInfo: any) => {
  showCheckoutDialog.value = false;
  pendingDeliveryInfo.value = deliveryInfo;
  showPaymentDialog.value = true;
};

const handlePayment = async (paymentMethod: string) => {
  if (!pendingOrderData.value || !pendingDeliveryInfo.value) return;

  showPaymentDialog.value = false;
  $q.loading.show({ message: "결제 처리 중..." });

  try {
    const orderRes = await createDirectOrder({
      memberId: userStore.memberId!,
      productId: pendingOrderData.value.productId,
      quantity: pendingOrderData.value.quantity,
      optionIds: pendingOrderData.value.optionIds,
      deliveryMethod: "SHIPPING",
      ...pendingDeliveryInfo.value,
    });

    const orderId = (orderRes.data as any).id;

    await processPayment(orderId, paymentMethod);

    $q.notify({ type: "positive", message: "주문 및 결제가 완료되었습니다." });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  } catch (e: any) {
    console.error(e);
    $q.notify({
      type: "negative",
      message: "결제 실패: " + (e.response?.data?.message || "알 수 없는 오류"),
    });
  } finally {
    $q.loading.hide();
    pendingOrderData.value = null;
    pendingDeliveryInfo.value = null;
  }
};

const confirmOptions = () => {
  const { product, actionType, selectedOptionIds } = optionDialog.value;
  if (!product) return;

  if (actionType === "CART") {
    processAddToCart(product, selectedOptionIds);
  } else if (actionType === "ORDER") {
    processDirectOrder(product, selectedOptionIds);
  }
  optionDialog.value.show = false;
};

onMounted(() => {
  systemStore.fetchCodes();
});
</script>

<style lang="scss" scoped>
// Scoped styles if any
</style>
