const { createApp } = Vue;
import { userProductModal } from './components/userProductModal.js';


const url = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'vue-hexschool-product-list';

// VeeValid
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('./zh_TW.json');

configure({
    generateMessage: localize('zh_TW'),
//   validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

// 1. 建立元件
// 2. 生成 vue 元件
// 3. 渲染至畫面上
const app = createApp({
    data() {
        return {
            products: [],
            product: {},
            cart: {},
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            loadingItem: '', //存 ID
        }
    },
    methods: {
        // 產品列表
        getProducts() {
            let loader = this.$loading.show();
            axios.get(`${url}/api/${apiPath}/products`)
            .then(res => {
                this.products = res.data.products;
                loader.hide();
            })
            .catch(err => {
                alert(err.data.message);
                loader.hide();
            });
        },

        // 單一產品細節
        getProduct(id) {
            this.loadingItem = id;
            axios.get(`${url}/api/${apiPath}/product/${id}`)
            .then(res => {
                this.product = res.data.product;
                this.$refs.userProductModal.showModal();
                this.loadingItem = '';
            })
            .catch(err => {
                alert(err.data.message);
            });
        },

        // 加入購物車
        addCart(product_id, qty = 1) {
            this.loadingItem = product_id;
            axios.post(`${url}/api/${apiPath}/cart`, {
                data: { product_id, qty }
            })
            .then(res => {
                this.$refs.userProductModal.hideModal();
                this.getCart();
                alert(res.data.message);
                this.loadingItem = '';
            })
            .catch(err => {
                alert(err.data.message);
            });
        },

        // 購物車列表
        getCart() {
            let loader = this.$loading.show();
            axios.get(`${url}/api/${apiPath}/cart`)
            .then(res => {
                this.cart = res.data.data;
                loader.hide();
            })
            .catch(err => {
                alert(err.data.message);
                loader.hide();
            });
        },

        // 刪除購物車項目（單一）
        delCart(id) {
            this.loadingItem = id;
            axios.delete(`${url}/api/${apiPath}/cart/${id}`)
            .then(res => {
                this.getCart();
                alert(res.data.message);
            })
            .catch(err => {
                alert(err.data.message);
            });
        },

        // 刪除購物車項目（全部）
        delCars() {
            axios.delete(`${url}/api/${apiPath}/carts`)
            .then(res => {
                this.getCart();
                alert(res.data.message);
                this.loadingItem = '';
            })
            .catch(err => {
                alert(err.data.message);
            });
        },

        // 調整購物車產品數量
        updateCart(data) {
            this.loadingItem = data.id;
            axios.put(`${url}/api/${apiPath}/cart/${data.id}`, {
                data: {
                    product_id: data.product_id,
                    qty: data.qty,
                }
            })
            .then(res => {
                this.getCart();
                alert(res.data.message);
                this.loadingItem = '';
            })
            .catch(err => {
                alert(err.data.message);
            });
        },

        // 結帳付款
        createOrder() {
            axios.post(`${url}/api/${apiPath}/order`, { data: this.form })
            .then(res => {
                this.$refs.form.resetForm();
                this.form = {
                    user: {
                        name: '',
                        email: '',
                        tel: '',
                        address: ''
                    },
                    message: ''
                }
                this.getCart();
                alert(res.data.message);
            })
            .catch(err => {
                alert(err.data.message);
            });
        }
    },
    components: {
        userProductModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },

});
app.use(VueLoading.LoadingPlugin);
app.mount('#app');