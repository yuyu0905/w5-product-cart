export const userProductModal = {
    template: '#userProductModal',
    props: ['product'],
    data() {
        return {
            modal: '',
            qty: 1,
        }
    },
    methods: {
        showModal() {
            this.qty = 1;
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        },
        addCart() {
            this.$emit('addCart', this.product.id, this.qty);
        }
    },
    mounted() {
        // dom 生成後，再取得 model
        this.modal = new bootstrap.Modal(this.$refs.modal, { keyboard: false });
    }
}