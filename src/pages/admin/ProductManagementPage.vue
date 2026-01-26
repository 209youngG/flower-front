<template>
  <q-page padding>
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6">상품 관리</div>
      <q-btn
        color="primary"
        label="상품 등록"
        icon="add"
        @click="openDialog()"
      />
    </div>

    <q-table
      title="상품 목록"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      @request="onRequest"
      :loading="isLoading || systemStore.loading"
      binary-state-sort
    >
      <template v-slot:body-cell-thumbnail="props">
        <q-td :props="props">
          <q-img
            :src="
              props.row.thumbnailUrl ||
              'https://cdn.quasar.dev/img/parallax2.jpg'
            "
            style="width: 50px; height: 50px; border-radius: 4px"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            icon="edit"
            color="primary"
            @click="openDialog(props.row)"
          />
          <q-btn
            flat
            round
            icon="delete"
            color="negative"
            @click="confirmDelete(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- 상품 등록/수정 다이얼로그 -->
    <q-dialog v-model="dialogOpen">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? "상품 수정" : "상품 등록" }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-sm">
              <div class="col-8">
                <q-input
                  v-model="form.name"
                  label="상품명"
                  filled
                  :rules="[(val) => !!val || '상품명을 입력해주세요']"
                />
              </div>
              <div class="col-4">
                <q-input
                  v-model="form.productCode"
                  label="상품코드"
                  filled
                  :rules="[(val) => !!val || '상품코드를 입력해주세요']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  v-model.number="form.price"
                  label="가격"
                  type="number"
                  filled
                  :rules="[(val) => val >= 0 || '0 이상 입력']"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="form.stockQuantity"
                  label="재고"
                  type="number"
                  filled
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-select
                  v-model="form.category"
                  :options="systemStore.categoryOptions"
                  label="카테고리"
                  filled
                  emit-value
                  map-options
                  :loading="systemStore.loading"
                />
              </div>
              <div class="col-6">
                <q-select
                  v-model="form.deliveryType"
                  :options="systemStore.deliveryOptions"
                  label="배송 타입"
                  filled
                  emit-value
                  map-options
                  :loading="systemStore.loading"
                  :rules="[(val) => !!val || '배송 타입을 선택해주세요']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-6">
                <q-toggle v-model="form.isActive" label="판매 활성화" />
              </div>
              <div class="col-6">
                <q-toggle
                  v-model="form.isAvailableToday"
                  label="당일 배송 가능"
                  color="green"
                />
              </div>
            </div>

            <q-input v-model="form.thumbnailUrl" label="썸네일 URL" filled />
            <q-input
              v-model="form.description"
              label="설명"
              type="textarea"
              filled
            />

            <q-separator class="q-my-md" />

            <div>
              <div class="text-subtitle2 q-mb-sm flex justify-between">
                <span>옵션 관리</span>
                <q-btn
                  size="sm"
                  label="옵션 추가"
                  icon="add"
                  flat
                  color="primary"
                  @click="addOption"
                />
              </div>

              <div
                v-if="form.options.length === 0"
                class="text-grey text-caption text-center q-py-sm bg-grey-1 rounded-borders"
              >
                등록된 옵션이 없습니다.
              </div>

              <div
                v-for="(opt, idx) in form.options"
                :key="idx"
                class="row q-col-gutter-sm items-center q-mb-sm bg-grey-1 q-pa-xs rounded-borders"
              >
                <div class="col-4">
                  <q-input
                    v-model="opt.name"
                    label="옵션명"
                    dense
                    outlined
                    bg-color="white"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-model="opt.value"
                    label="값"
                    dense
                    outlined
                    bg-color="white"
                  />
                </div>
                <div class="col-4">
                  <q-input
                    v-model.number="opt.priceAdjustment"
                    label="가격조정"
                    type="number"
                    dense
                    outlined
                    bg-color="white"
                  />
                </div>
                <div class="col-1 text-center">
                  <q-btn
                    icon="close"
                    color="negative"
                    flat
                    dense
                    round
                    size="sm"
                    @click="removeOption(idx)"
                  />
                </div>
              </div>
            </div>

            <div class="row justify-end q-mt-lg">
              <q-btn label="취소" flat v-close-popup class="q-mr-sm" />
              <q-btn
                :label="isEdit ? '수정' : '등록'"
                type="submit"
                color="primary"
                :loading="isSubmitting"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { useQuasar } from "quasar";
import { useSystemStore } from "stores/system-store";
import {
  getProductsPaged,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  type Product,
  type CreateProductRequest,
} from "src/api/product";

const $q = useQuasar();
const queryClient = useQueryClient();
const systemStore = useSystemStore();
const isLoadingDetail = ref(false);

// --- Data Grid State ---
const pagination = ref({
  sortBy: "id",
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0, // Server-side total count
});

// --- Dialog & Form State ---
const dialogOpen = ref(false);
const isSubmitting = ref(false);

interface ProductForm extends CreateProductRequest {
  id: number | null;
  isActive: boolean;
  isAvailableToday: boolean;
}

const initialForm: ProductForm = {
  id: null,
  name: "",
  productCode: "",
  price: 0,
  stockQuantity: 0,
  description: "",
  thumbnailUrl: "",
  category: "FLOWER_BOUQUET",
  deliveryType: "PARCEL",
  options: [],
  isActive: true,
  isAvailableToday: false,
};

const form = ref<ProductForm>({ ...initialForm });

const isEdit = computed(() => !!form.value.id);

// --- API Query ---
const {
  data: pageData,
  isLoading,
} = useQuery({
  queryKey: ["products", pagination], // Refetch when pagination changes
  queryFn: () =>
    getProductsPaged({
      page: pagination.value.page - 1, // API is 0-based
      size: pagination.value.rowsPerPage,
      sort: [
        `${pagination.value.sortBy},${
          pagination.value.descending ? "desc" : "asc"
        }`,
      ],
    }),
  placeholderData: (previousData) => previousData, // Keep previous data while fetching (no flicker)
});

// Sync rowsNumber from server
watch(pageData, (newData) => {
  if (newData) {
    pagination.value.rowsNumber = newData.totalElements;
  }
});

const rows = computed(() => {
  if (pageData.value) {
    return pageData.value.content;
  }
  return [];
});

// Handle Table Request (Sort/Page)
const onRequest = (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value = {
    ...pagination.value,
    page,
    rowsPerPage,
    sortBy,
    descending,
  };
};

// --- Columns ---
const columns = [
  { name: "id", label: "ID", field: "id", sortable: true },
  { name: "thumbnail", label: "이미지", field: "thumbnail", align: "center" },
  {
    name: "name",
    label: "상품명",
    field: "name",
    sortable: true,
    align: "left",
  },
  {
    name: "category",
    label: "카테고리",
    field: "category",
    format: (val: any) => systemStore.getCategoryLabel(val),
  },
  {
    name: "deliveryType",
    label: "배송타입",
    field: "deliveryType",
    format: (val: any) => systemStore.getDeliveryLabel(val),
    align: "center",
  },
  {
    name: "price",
    label: "가격",
    field: "price",
    sortable: true,
    format: (val: number) => `${val.toLocaleString()}원`,
  },
  {
    name: "stockQuantity",
    label: "재고",
    field: "stockQuantity",
    sortable: true,
  },
  { name: "actions", label: "관리", field: "actions", align: "center" },
];

// --- Actions ---

const openDialog = async (product: Product | null = null) => {
  if (product) {
    try {
      isLoadingDetail.value = true;
      const detail = await getProduct(product.id);
      
      form.value = {
        id: detail.id,
        name: detail.name,
        productCode: detail.productCode || "",
        price: detail.price,
        stockQuantity: detail.stockQuantity,
        description: detail.description || "",
        thumbnailUrl: detail.thumbnailUrl || "",
        category: (detail.category as any) || "FLOWER_BOUQUET",
        deliveryType: (detail.deliveryType as any) || "PARCEL",
        options: (detail.options || []).map((opt) => ({
          name: opt.name,
          value: opt.optionValue,
          priceAdjustment: opt.priceAdjustment,
        })),
        isActive: detail.isActive ?? true,
        isAvailableToday: detail.isAvailableToday ?? false,
      };
      dialogOpen.value = true;
    } catch (error) {
      $q.notify({ type: "negative", message: "상품 상세 정보를 불러오는데 실패했습니다." });
    } finally {
      isLoadingDetail.value = false;
    }
  } else {
    form.value = JSON.parse(JSON.stringify(initialForm));
    dialogOpen.value = true;
  }
};

const addOption = () => {
  form.value.options = form.value.options || [];
  form.value.options.push({ name: "", value: "", priceAdjustment: 0 });
};

const removeOption = (index: number) => {
  if (form.value.options) {
    form.value.options.splice(index, 1);
  }
};

// --- Mutations ---
const createMutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    $q.notify({ type: "positive", message: "등록 완료" });
    dialogOpen.value = false;
    queryClient.invalidateQueries({ queryKey: ["products"] });
  },
  onError: () => $q.notify({ type: "negative", message: "등록 실패" }),
});

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: number; data: any }) =>
    updateProduct(id, data),
  onSuccess: () => {
    $q.notify({ type: "positive", message: "수정 완료" });
    dialogOpen.value = false;
    queryClient.invalidateQueries({ queryKey: ["products"] });
  },
  onError: () => $q.notify({ type: "negative", message: "수정 실패" }),
});

const deleteMutation = useMutation({
  mutationFn: deleteProduct,
  onSuccess: () => {
    $q.notify({ type: "positive", message: "삭제 완료" });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  },
  onError: () => $q.notify({ type: "negative", message: "삭제 실패" }),
});

const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      ...form.value,
      // Transform form data to API DTO if needed
    };

    if (isEdit.value && form.value.id) {
      await updateMutation.mutateAsync({ id: form.value.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (product: Product) => {
  $q.dialog({
    title: "삭제 확인",
    message: `${product.name} 상품을 삭제하시겠습니까?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteMutation.mutate(product.id);
  });
};

onMounted(() => {
  // Fetch system codes on mount
  systemStore.fetchCodes();
});
</script>
