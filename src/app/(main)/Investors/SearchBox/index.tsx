import SearchIcon from "@mui/icons-material/Search";

interface Props {
  searchKey: string;
  setSearchKey: (key: string) => void;
}

export default function SearchBox({
  searchKey,
  setSearchKey,
}: Props) {
  return (
    <div
      className="flex items-center px-2 my-2 gap-2 border border-solid border-purple-600 rounded-lg"
    >
      <input
        className="py-2 px-4 outline-none w-full bg-transparent text-xs"
        placeholder="Search Address"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <div className="text-purple-600">
        <SearchIcon />
      </div>
    </div>
  );
}
