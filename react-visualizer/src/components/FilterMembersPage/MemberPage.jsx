import { useParams, useLocation } from "react-router-dom";
import Nav from "../Nav";
export default function MemberPage() {
  const { memberId } = useParams();
  const location = useLocation();

  // Access the member data from location state
  const memberFields = location.state.memberFields;

  if (!memberFields) {
    return <div>No data available for member {memberId}.</div>;
  }

  return (
    <div>
      <Nav />
      <h1>
        {memberFields.first_name} {memberFields.last_name}
      </h1>
      <section for="committees_and_unions">
        <div>
          Committee:
          {memberFields.committee.length === 0
            ? " N/A"
            : memberFields.committee}
        </div>
        <div>Union member: {memberFields.union_member}</div>
        {memberFields.union_name === "" ? (
          <div></div>
        ) : (
          <p>
            <div>Union name: {memberFields.union_name}</div>
            <div>Union local?: {memberFields.union_local}</div>
          </p>
        )}
      </section>
      <section for="contact">
        <h2>Contact information</h2>
        <div>Best phone number: {memberFields.best_phone}</div>
        <div>Mobile phone: {memberFields.mobile_phone}</div>
        <div>Email: {memberFields.email}</div>

        <div>
          Discord: {memberFields.discord_name} status:{" "}
          {memberFields.discord_status}
        </div>
        <div>
          Mailing address: {memberFields.address1}, {memberFields.city}{" "}
          {memberFields.zip}, {memberFields.country}
        </div>
      </section>

      <section for="membership_info">
        <h2>Membership</h2>
        <div>
          Joined in the past month?: {memberFields.new_member_past_month}
        </div>
        <div>DSA Chapter: {memberFields.dsa_chapter}</div>
        <div>Membership type: {memberFields.membership_type}</div>
        <div>Monthly dues status: {memberFields.monthly_dues_status}</div>
        <div>Yearly dues status: {memberFields.yearly_dues_status}</div>
        <div>Status: {memberFields.membership_status}</div>
        <div>Join Date: {memberFields.join_date}</div>
        <div>Expiry Date: {memberFields.xdate}</div>
      </section>
    </div>
  );
}
