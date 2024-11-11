import Member from "./Member";

export default function NewMembersList({ members }) {

  return (
    <div>
      <h1>DSA members</h1>
      <div>
        {members.map((member) => (
          <Member key={member.pk} fields={member.fields} />
        ))}
      </div>
    </div>
  );
}
