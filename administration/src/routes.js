import CategoryDetail from "./pages/CategoryDetail";
import CategoryList from "./pages/CategoryList";
import CategoryEavDetail from "./pages/CategoryEavDetail";
import CategoryEavList from "./pages/CategoryEavList";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerList from "./pages/CustomerList";
import OrderDetail from "./pages/OrderDetail";
import OrderList from "./pages/OrderList";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import ProductEavDetail from "./pages/ProductEavDetail";
import ProductEavList from "./pages/ProductEavList";
import WarrantyDetail from "./pages/WarrantyDetail";
import WarrantyList from "./pages/WarrantyList";

const routes = [
    {
        path: "/category/:entity_id",
        component: CategoryDetail,
        ref_name: "Category detail",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/category",
        component: CategoryList,
        ref_name: "Category",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/eav/category/:entity_id",
        component: CategoryEavDetail,
        ref_name: "Category eav detail",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/eav/category",
        component: CategoryEavList,
        ref_name: "Category eav",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/customer/:entity_id",
        component: CustomerDetail,
        ref_name: "Customer detail",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/customer",
        component: CustomerList,
        ref_name: "Customer",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/order/:entity_id",
        component: OrderDetail,
        ref_name: "Order detail",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/order",
        component: OrderList,
        ref_name: "Order",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/product/:entity_id",
        component: ProductDetail,
        ref_name: "Product detail",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/product",
        component: ProductList,
        ref_name: "Product",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/eav/product/:entity_id",
        component: ProductEavDetail,
        ref_name: "Product eav detail",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/eav/product",
        component: ProductEavList,
        ref_name: "Product eav",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/warranty/:entity_id",
        component: WarrantyDetail,
        ref_name: "Warranty detail",
        showOnNavbar: false,
        showOnSidebar: false
    },
    {
        path: "/warranty",
        component: WarrantyList,
        ref_name: "Warranty list",
        showOnNavbar: false,
        showOnSidebar: false
    }
]

export default routes;