import React from "react";
import { Link } from "react-router-dom";

const AuthorItems = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            <div className="col-12 text-center">
              <p>No NFT items found for this author.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.map((item) => {
            const nftId = item.nftId ?? item.id;

            return (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={nftId}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <img
                      className="lazy"
                      src={item.authorImage}
                      alt={item.authorName || ""}
                    />
                    <i className="fa fa-check"></i>
                  </div>

                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                      </div>
                    </div>

                    <Link
                      to={`/item-details/${encodeURIComponent(
                        nftId
                      )}`}
                      state={{ item }}
                    >
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt={item.title || ""}
                      />
                    </Link>
                  </div>

                  <div className="nft__item_info">
                    <Link
                      to={`/item-details/${encodeURIComponent(
                        nftId
                      )}`}
                      state={{ item }}
                    >
                      <h4>{item.title}</h4>
                    </Link>

                    {item.price !== undefined && (
                      <div className="nft__item_price">
                        {item.price} ETH
                      </div>
                    )}

                    {item.likes !== undefined && (
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;