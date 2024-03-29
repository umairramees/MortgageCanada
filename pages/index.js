import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Doughnut } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { useEffect, useState } from "react";
import HomePrice from "./components/homeprice";
import Amortization from "./components/amortization";
import MortgageRate from "./components/mortgagerate";
import HomeBuyer from "./components/homebuyer";
import CashClose from "./components/cashclose";
import MonthlyPayment from "./components/monthlypayment";

export default function Home() {
  const [homeState, setHomeState] = useState({
    homePrice: 425000,
    downPrice: 20,
    year: 25,
    rate: 5,
  });

  const [paymentState, setPaymentState] = useState({
    tax: 280,
    insurance: 66,
    pmi: 0,
    foa: 0,
  });

  const homeStateChange = (data) => {
    setHomeState(data);
  };

  const paymentStateChange = (data) => {
    setPaymentState(data);
  };

  const [principal, setPrincipal] = useState(0);
  const [total, setTotal] = useState(0);
  const [interest, setInterest] = useState(0);
  const [ddata, setDData] = useState([]);
  const [landTransferTax, setLandTransferTax] = useState(0);
  const [mortgageInsurance, setMortgageInsurance] = useState(0);
  const [newbie, setNewbieHome] = useState(false);
  const [municipal, setMunicipal] = useState(0);
  const [rebate, setRebate] = useState(0);

  useEffect(() => {
    setTotal(
      principal +
        paymentState.foa +
        paymentState.pmi +
        paymentState.tax +
        paymentState.insurance
    );
    setDData([
      principal,
      interest,
      paymentState.tax,
      paymentState.insurance,
      paymentState.pmi,
      paymentState.foa,
    ]);
  }, [
    principal,
    paymentState.principal,
    paymentState.foa,
    paymentState.pmi,
    paymentState.tax,
    paymentState.insurance,
    interest,
  ]);

  useEffect(() => {
    let P = (homeState.homePrice * (100 - homeState.downPrice)) / 100;
    let r = homeState.rate / 12 / 100; //0.0041(6)
    let n = homeState.year * 12;
    let M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setPrincipal(parseFloat(P / n));
    setInterest(parseFloat(M - P / n));
  }, [homeState]);

  useEffect(() => {
    setLandTransferTax(
      (homeState.homePrice * homeState.downPrice) / 100 + municipal - rebate
    );
  }, [homeState.downPrice, homeState.homePrice, municipal, rebate]);

  useEffect(() => {
    setMunicipal((homeState.homePrice * homeState.downPrice) / 100);
  }, [homeState.downPrice, homeState.homePrice]);

  useEffect(() => {
    let localRate = 0;
    if (homeState.homePrice <= 100000) {
      localRate = 0;
    } else if (homeState.homePrice <= 500000) {
      localRate = 0.05;
    } else {
      localRate = 0.75;
    }
    let val = newbie
      ? ((homeState.homePrice * homeState.downPrice) / 100) * localRate * 2
      : ((homeState.homePrice * homeState.downPrice) / 100) *
        (1 - localRate) *
        2;
    setRebate(parseInt(val));
  }, [homeState, newbie]);

  const labels = [
    "Principal",
    "Interest",
    "Property Tax",
    "Homeowner's insurance",
    "PMI",
    "HOA fees",
  ];

  const doughnutdata = {
    labels: labels,
    datasets: [
      {
        label: "Monthly payment breakdown",
        data: ddata,
        backgroundColor: [
          "#4949d0",
          "#ffe553",
          "#66ff99",
          "#4d94ff",
          "#ff66ff",
          "#5cd65c",
        ],
        borderColor: [
          "#008800",
          "#000088",
          "#008800",
          "#880000",
          "#008800",
          "#008888",
          "#FF0000",
        ],
        borderWidth: 0,
        hoverBorderWidth: 0,
        hoverBorderColor: [
          "rgb(255, 99, 132)",
          "#FF2553",
          "#006600",
          "#880000",
          "#008800",
          "#008888",
          "#FF0000",
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Mortgage Calculator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"container " + styles.main}>
        <div className={styles.header}>
          <h1>Mortgage Calculator</h1>
        </div>
        <div className="row">
          <div className="col-md-4">
            <HomePrice
              homeState={homeState}
              homeStateChange={homeStateChange}
            />
            <Amortization homeState={homeState} paid={interest} />
          </div>
          <div className="col-md-8">
            <p className={styles.tab}>Payment Breakdown</p>
            <h2>Monthly Payment Breakdown</h2>
            <div className={`row`}>
              <div className={"col-md-6 text-center " + styles.relativeDiv}>
                <br />
                <Doughnut
                  data={doughnutdata}
                  options={{
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false,
                        labels: {
                          padding: 20,
                        },
                      },
                    },
                  }}
                />
                <span className={styles.totalFee}>${total && total.toFixed(0)}</span>
              </div>
              <div className="col-md-6">
                <MonthlyPayment
                  paymentState={paymentState}
                  principal={principal}
                  interest={interest}
                  paymentStateChange={paymentStateChange}
                  total={total}
                  setTotal={(e) => setTotal(e)}
                />
              </div>
            </div>
            <br />
            <br />
            <MortgageRate />
          </div>
        </div>
        <hr />
        <HomeBuyer
          municipal={municipal}
          rebate={rebate}
          landTransferTax={landTransferTax}
          setNewbieHome={setNewbieHome}
        />
        <hr />
        <CashClose
          homeState={homeState}
          landTransferTax={landTransferTax}
          mortgageInsurance={mortgageInsurance}
        />
      </main>
      <p className="text-center">Mortgage Calculator @ 2023</p>
      <br />
    </>
  );
}
