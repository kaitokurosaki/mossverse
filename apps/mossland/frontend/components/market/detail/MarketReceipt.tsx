import { types } from "@platform/data-access";
import React from "react";
import styled from "styled-components";
import Image from "next/image";

type MarketReceiptProps = {
  receipt: types.Receipt;
};

export const MarketReceipt = ({ receipt }: MarketReceiptProps) => {
  const exchangeExporter = (i: types.Exchange, className: "inputs" | "outputs") => {
    return (
      <div key={i.id} className={className}>
        {"\b\b>"}
        {i.type === "product" && i.product && (
          <>
            <img className="item-image" src={i.product.image.url} />
            {i.product.name}
          </>
        )}
        {i.type === "thing" && i.thing && (
          <>
            <img className="item-image" src={i.thing.image.url} />
            {i.thing.name} : {i.num}
          </>
        )}
        {i.type === "token" && i.token && (
          <>
            <img className="item-image" src={(i.token.meta && i.token.meta.image) ?? ""} />
            {`${(i.token.meta && i.token.meta.name) ?? "unknown token"} #${i.token.tokenId}`}
          </>
        )}
      </div>
    );
  };
  return (
    <MarketDescContainer>
      <div className="result-text">Trade success!</div>
      {/* <div className="from-to">{`${receipt.from.nickname} -> ${receipt.to.nickname}`}</div> */}
      {`${receipt.to.nickname}`}
      {receipt.inputs.map((i) => exchangeExporter(i, "inputs"))}
      {receipt.outputs.map((i) => exchangeExporter(i, "outputs"))}
      {`You`}
      {receipt.inputs.map((i) => exchangeExporter(i, "outputs"))}
      {receipt.outputs.map((i) => exchangeExporter(i, "inputs"))}
      {`order number : ${receipt.id}`}
    </MarketDescContainer>
  );
};

const MarketDescContainer = styled.div`
  padding-top: 5px;
  .result-text {
    font-size: 40px;
    font-weight: bold;
    border-bottom: 2px solid #000;
    margin-bottom: 20px;
  }
  .from-to {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0px;
  }
  .inputs {
    font-size: 16px;
    color: blue;
  }
  .outputs {
    font-size: 16px;
    color: red;
  }
  .item-image {
    width: 30px;
    height: 30px;
    margin: 0px 10px;
  }
`;
