import React, { useEffect } from "react";
import { types, userStore, listingStore } from "@platform/data-access";
import { keyringStore, networkStore, walletStore } from "@shared/data-access";
import { Market, DefaultButton } from "@platform/ui-web";
import styled from "styled-components";
import { Connect, MyProfile } from "../common/";
import { darken } from "polished";
import { BiChevronRight } from "react-icons/bi";
import { Utils } from "@shared/util";

export const MarketBalance = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();
  const onClickMyTokensButton = () => listingStore.setState({ filter: "myTokens" });
  const MMOC = self && self.items.find((item) => item.thing.name === "MMOC");
  useEffect(() => {
    self && self.keyring && walletStore.setState({ wallet: self.keyring.wallets[0] });
  }, [self]);
  return (
    <MarketBalanceContainer>
      <div className="flex-item">
        {MMOC ? (
          <div className="balance-item">
            <div className="label">
              {/* <img src="/images/m_coin.png" /> */}
              <img src={MMOC.thing.image.url} />
              {MMOC.thing.name ?? "MMOC"}
            </div>
            <div className="balance">{MMOC.num ? Utils.numberWithCommas(MMOC.num) : 0}</div>
          </div>
        ) : (
          <div className="balance-item">
            <div className="label">
              <img src="/images/mm_coin.png" />
              {"MMOC"}
            </div>
            <div className="balance">{0}</div>
          </div>
        )}
      </div>
      {/* {wallet ? (
        <div className="flex-item">
          <MyProfile nickname={self?.nickname || ""} />
          <div className="my-tokens-button" onClick={onClickMyTokensButton}>
            MyTokens
            <div className="arrow">
              <BiChevronRight />
            </div>
          </div>
        </div>
      ) : (
        <Connect />
      )} */}
    </MarketBalanceContainer>
  );
};

const MarketBalanceContainer = styled.div`
  border-bottom: 1px solid #000;
  display: flex;
  padding: 20px 23px;
  gap: 13px;
  .flex-item {
    width: 50%;
    .balance-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .label {
        font-weight: bold;
        font-size: 18px;
        color: #555555;
        img {
          width: 13px;
          margin-right: 2px;
        }
      }
      .balance {
        font-size: 18px;
      }
    }
  }
  .address {
    background-color: #e8e8e8;
    padding: 5px 10px;
    border-radius: 4px;
    overflow: hidden; // 을 사용해 영역을 감출 것
    text-overflow: ellipsis; // 로 ... 을 만들기
    white-space: nowrap; // 아래줄로 내려가는 것을 막기위해
  }
  .my-tokens-button {
    position: relative;
    background-color: #ffe177;
    font-size: 18px;
    text-align: center;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      background-color: ${darken(0.2, "#ffe177")};
    }
    .arrow {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      svg {
        font-size: 30px;
      }
    }
  }
`;
