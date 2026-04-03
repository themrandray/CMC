import { Card } from "antd";

function CryptocurrencyCard(props) {
  const { currency, isDark } = props;

  const price = currency.quote?.USD?.price;
  const percentChange24h = currency.quote?.USD?.percent_change_24h;
  const marketCap = currency.quote?.USD?.market_cap;

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "N/A";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatMarketCap = (value) => {
    if (value === undefined || value === null) return "N/A";

    if (value >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(3)}T`;
    }
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(3)}B`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(3)}M`;
    }

    return formatCurrency(value);
  };

  const isPositive = percentChange24h >= 0;

  return (
    <Card
      title={
        <div className="flex items-center gap-3">
          <img
            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${currency.id}.png`}
            alt={currency.name}
            className="w-12 h-12"
          />
          <span className="text-2xl font-semibold">{currency.name}</span>
        </div>
      }
      className={`rounded-2xl shadow-xl transition-colors duration-300 ${
        isDark ? "bg-[#0f1724] border-slate-700" : "bg-white border-zinc-200"
      }`}
      style={{ width: 620 }}
    >
      <div
        className={`space-y-6 text-3xl transition-colors duration-300 ${
          isDark ? "text-slate-100" : "text-zinc-900"
        }`}
      >
        <p>
          Current price: {formatCurrency(price)}
        </p>

        <p>
          Price change in 24 hours:{" "}
          <span
            className={
              isPositive
                ? "text-emerald-400 font-semibold"
                : "text-red-400 font-semibold"
            }
          >
            {percentChange24h !== undefined && percentChange24h !== null
              ? `${percentChange24h.toFixed(2)}%`
              : "N/A"}
          </span>
        </p>

        <p>
          Current market cap: {formatMarketCap(marketCap)}
        </p>
      </div>
    </Card>
  );
}

export default CryptocurrencyCard;