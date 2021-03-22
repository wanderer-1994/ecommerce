import "./Product.css";
import { useEffect, useState, Fragment } from "react";
import $ from "../jquery/Jquery";
import productModel from "../objectModels/ProductModel";
import api from "../api/mockApi";

function Product () {

    const [product, setProduct] = useState({});

    useEffect(() => {
        $(".gallerry").on("click.gallerryRotate", function () {
            let img_items = $(this).find(".image-item");
            img_items.each(function (index, value) {
                let nth = parseInt($(this).css("--nth")) + 1;
                let total = parseInt($(this).css("--total"));
                $(this).css("--nth", nth);
                if (nth % total === 0) {
                    $(".gallerry").find(".main-image").css({
                        "background-image": $(this).find(".absolute").css("background-image"),
                        "background-size": "cover",
                        "background-position": "center"
                    }
                    )
                }
            });
        });
        return () => {
            $(".gallerry").off("click.gallerryRotate");
        }
    }, []);

    useEffect(() => {
        async function fetchData () {
            try {
                let search = await api.searchProduct();
                let product = search.products[0] || {};
                setProduct(product);
            } catch (err) {

            }
        };
        fetchData();
    }, [])

    function renderProduct (product) {
        let gallerry = productModel.getGallerry(product);
        return (
            <Fragment>
                <div className="gallerry">
                    <div className="main-image"
                        style={{
                            backgroundImage: `url(${gallerry[0] ? gallerry[0].image : ""})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                    </div>
                    <div className="list">
                        {gallerry.map((item, index) => {
                            return (
                                <div key={index} className="image-item" style={{
                                    "--nth": index,
                                    "--total": gallerry.length
                                }}
                                >
                                    <div 
                                        className="absolute" 
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                            backgroundSize: "contain",
                                            backgroundPosition: "center"
                                        }}
                                    >
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="info">
                    <h4 className="name">TAI NGHE NHÉT TAI BOROFONE BM27</h4>
                    <div className="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, suscipit optio numquam dicta debitis repellat labore eligendi corrupti nulla at quas magni? Quod, beatae nostrum eius qui quas debitis itaque.</div>
                </div>
                <div className="related">
                    
                </div>
            </Fragment>
        )
    }

    return (
        <div className="product-page">
            {renderProduct(product)}
        </div>
    )
}

export default Product;