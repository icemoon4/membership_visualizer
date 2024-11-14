import styles from "./searchFilter.module.css";

export default function SearchFilter({
  setStateParameters,
  query,
  setQuery,
  setReRender,
  reRender,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    const currentParameters = {};
    setStateParameters({}); //to prevent parameters lingering from previous search
    if (query.includes(":")) {
      //we know the user is using parameters in this case
      const paramPairsArray = query
        .toLowerCase()
        .match(/(?:[^\s:"']+|['"][^'"]*["'])+/g); //so clean those params up and put em in an array
      console.log(paramPairsArray);
      for (let i = 0; i < paramPairsArray.length - 1; i += 2) {
        const key = paramPairsArray[i];
        const value = paramPairsArray[i + 1];
        currentParameters[key] = value;
      }
      setStateParameters(currentParameters); //updates our state to reflect our placeholder parameter object
      //console.log(`length is ${Object.keys(stateParameters).length}`);
      //console.log(stateParameters);
    }
    setReRender(!reRender); //setting state forces the page to rerender basically
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        value={query}
        placeholder="first_name:Anton last_name:Faulkner"
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        className={styles.Search}
      />
      <button>Go!</button>
    </form>
  );
}
