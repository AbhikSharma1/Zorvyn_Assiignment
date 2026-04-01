import useStore from "./store/useStore";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

export default function App() {
  const activePage = useStore((s) => s.activePage);

  const pages = {
    dashboard:    <Dashboard />,
    transactions: <Transactions />,
    insights:     <Insights />,
  };

  return (
    <Layout>
      {pages[activePage] || <Dashboard />}
    </Layout>
  );
}
