import ReceitaForm from "./components/ReceitaForm";
function Page() {
  return (
    <div className="page">
      <ReceitaForm onGenerate={(data) => console.log(data)} />
    </div>
  );
}

export default Page;
