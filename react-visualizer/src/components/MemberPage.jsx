import { useParams, useLocation } from "react-router-dom";
import Nav from "./Nav";
import React, { useEffect, useState, useContext } from "react";
import { MembersContext } from "./MembersContext";

export default function MemberPage() {
  const { memberId } = useParams();
  const { members, isLoading: isGlobalLoading } = useContext(MembersContext); //aliasing membersContext isLoading to a new name so we can check that and
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //checking if member is in global context
    const memberFromContext = members.find((m) => m.pk.toString() === memberId);

    if (memberFromContext) {
      setMember(memberFromContext); // Use context data
    } else {
      //Fetching from the server if there's no current context (such as starting your session from a member link you were sent)
      async function fetchMemberById() {
        setIsLoading(true);
        try {
          const res = await fetch(`http://localhost:8000/api/${memberId}/data`);
          const data = await res.json();
          setMember(JSON.parse(data)); //find the guy with the passed memberId
        } catch (error) {
          console.error("Failed to fetch member data", error);
        } finally {
          setIsLoading(false);
        }
      }

      fetchMemberById();
    }
  }, [memberId, members]);

  if (isGlobalLoading || isLoading) {
    return <p>Loading member details...</p>;
  }

  if (!member) {
    return <p>Member not found.</p>;
  }

  return (
    <div>
      <h1>
        {member.fields.first_name} {member.fields.last_name}
      </h1>
      <section for="committees_and_unions">
        <div>
          Committee:
          {member.fields.committee.length === 0
            ? " N/A"
            : member.fields.committee}
        </div>
        <div>Union member: {member.fields.union_member}</div>
        {member.fields.union_name === "" ? (
          <div></div>
        ) : (
          <p>
            <div>Union name: {member.fields.union_name}</div>
            <div>Union local?: {member.fields.union_local}</div>
          </p>
        )}
      </section>
      <section for="contact">
        <h2>Contact information</h2>
        <div>Best phone number: {member.fields.best_phone}</div>
        <div>Mobile phone: {member.fields.mobile_phone}</div>
        <div>Email: {member.fields.email}</div>

        <div>
          Discord: {member.fields.discord_name} status:{" "}
          {member.fields.discord_status}
        </div>
        <div>
          Mailing address: {member.fields.address1}, {member.fields.city}{" "}
          {member.fields.zip}, {member.fields.country}
        </div>
      </section>

      <section for="membership_info">
        <h2>Membership</h2>
        <div>
          Joined in the past month?: {member.fields.new_member_past_month}
        </div>
        <div>DSA Chapter: {member.fields.dsa_chapter}</div>
        <div>Membership type: {member.fields.membership_type}</div>
        <div>Monthly dues status: {member.fields.monthly_dues_status}</div>
        <div>Yearly dues status: {member.fields.yearly_dues_status}</div>
        <div>Status: {member.fields.membership_status}</div>
        <div>Join Date: {member.fields.join_date}</div>
        <div>Expiry Date: {member.fields.xdate}</div>
      </section>
    </div>
  );
}
