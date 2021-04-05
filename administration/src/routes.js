import CategoryCreate from "./pages/CategoryCreate";
import CategoryDetail from "./pages/CategoryDetail";
import CategoryList from "./pages/CategoryList";
import CategoryEavCreate from "./pages/CategoryEavCreate";
import CategoryEavDetail from "./pages/CategoryEavDetail";
import CategoryEavList from "./pages/CategoryEavList";
import CustomerCreate from "./pages/CustomerCreate";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerList from "./pages/CustomerList";
import OrderCreate from "./pages/OrderCreate";
import OrderDetail from "./pages/OrderDetail";
import OrderList from "./pages/OrderList";
import ProductCreate from "./pages/ProductCreate";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import ProductEavCreate from "./pages/ProductEavCreate";
import ProductEavDetail from "./pages/ProductEavDetail";
import ProductEavList from "./pages/ProductEavList";
import WarrantyDetail from "./pages/WarrantyDetail";
import WarrantyList from "./pages/WarrantyList";

const routes = [
    {
        path: "/create/category",
        component: CategoryCreate,
        ref_name: "Category",
        showOnNavbar: false,
        showOnSidebar: false,
        title: "Add New Category"
    },
    {
        path: "/category/:entity_id",
        component: CategoryDetail,
        ref_name: "Category detail",
        showOnNavbar: false,
        showOnSidebar: false,
        title: "Category Detail"
    },
    {
        path: "/category",
        component: CategoryList,
        ref_name: "Category",
        showOnNavbar: false,
        showOnSidebar: true,
        title: "Category Management"
    },
    {
        path: "/create/eav/category",
        component: CategoryEavCreate,
        ref_name: "Category eav detail",
        showOnNavbar: false,
        showOnSidebar: false,
        title: "Add New Category Attribute"
    },
    {
        path: "/eav/category/:entity_id",
        component: CategoryEavDetail,
        ref_name: "Category eav detail",
        showOnNavbar: false,
        showOnSidebar: false,
        title: "Category atribute detail"
    },
    {
        path: "/eav/category",
        component: CategoryEavList,
        ref_name: "Category eav",
        showOnNavbar: false,
        showOnSidebar: true,
        title: "Category Eav Management"
    },
    {
        path: "/create/customer",
        component: CustomerCreate,
        ref_name: "Customer detail",
        showOnNavbar: false,
        showOnSidebar: false,
        title: "Add New Customer"
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
        showOnSidebar: true,
        title: "Customer Management"
    },
    {
        path: "/create/order",
        component: OrderCreate,
        ref_name: "Order detail",
        showOnNavbar: false,
        showOnSidebar: false,
        title: "Create New Order"
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
        showOnSidebar: true,
        title: "Order Management"
    },
    {
        path: "/create/product",
        component: ProductCreate,
        ref_name: "Product detail",
        showOnNavbar: false,
        showOnSidebar: false,
        title: "Add New Product"
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
        showOnSidebar: true,
        title: "Product Management"
    },
    {
        path: "/create/eav/product",
        component: ProductEavCreate,
        ref_name: "Product eav detail",
        showOnNavbar: false,
        showOnSidebar: false,
        title: "Add New Product Attribute"
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
        showOnSidebar: true,
        title: "Product Eav Management"
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
        ref_name: "Warranty",
        showOnNavbar: false,
        showOnSidebar: true,
        title: "Warranty Tracking"
    }
]

export default routes;