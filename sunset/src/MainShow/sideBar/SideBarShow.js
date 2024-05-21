
import Category from "./Category/Category";
import Prices from "./Prices/Prices";
import './SidebarShow.css'

const SidebarShow = () => {
  return (
    <>
      <section className="sidebarShow">

        <div className="logo-container">
          <a href="/index"><h1>Sunset</h1></a>
        </div>

        <Category  />
        <Prices  />
      </section>
    </>
  );
};

export default SidebarShow;