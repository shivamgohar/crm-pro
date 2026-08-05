import SearchBar from "../SearchBar";

export default function AppSearch(props) {
  return (
    <div className="search-box">
      <SearchBar {...props} />
    </div>
  );
}