import { useParams, useLocation } from "react-router-dom";
import Nav from "../Nav/Nav";
import React, { useEffect, useState, useContext } from "react";
import { MembersContext } from "../MembersContext";

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
          const res = await fetch(`/api/${memberId}/data`);
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
    <div id="cardContainer">
      <div className="memberCard">
        <h1>
          {member.fields.first_name} {member.fields.last_name}
        </h1>
        <section for="committees_and_unions">
          <div>
            <b>Committee:</b>
            {member.fields.committee.length === 0
              ? " N/A"
              : member.fields.committee}
          </div>
          <div>
            <b>Union member:</b> {member.fields.union_member}
          </div>
          {member.fields.union_name === "" ? (
            <div></div>
          ) : (
            <p>
              <div>
                <b>Union name:</b> {member.fields.union_name}
              </div>
              <div>
                <b>Union local?:</b> {member.fields.union_local}
              </div>
            </p>
          )}
        </section>
        <section for="contact">
          <h2>Contact information</h2>
          <div>
            <b>Best phone number:</b> {member.fields.best_phone}
          </div>
          <div>
            <b>Mobile phone:</b> {member.fields.mobile_phone}
          </div>
          <div>
            <b>Email:</b> {member.fields.email}
          </div>
          <div>
            <b>Discord:</b> {member.fields.discord_name}
          </div>
          <div>
            <b>Discord status:</b> {member.fields.discord_status}
          </div>
          <div>
            <b>Mailing address:</b> {member.fields.address1},{" "}
            {member.fields.city} {member.fields.zip}, {member.fields.country}
          </div>
        </section>

        <section for="membership_info">
          <h2>Membership</h2>
          <div>
            <b>Status:</b> {member.fields.membership_status}
          </div>
          <div>
            <b>DSA Chapter:</b> {member.fields.dsa_chapter}
          </div>
          <div>
            <b>Membership type:</b> {member.fields.membership_type}
          </div>
          <div>
            <b>Joined in the past month?:</b>{" "}
            {member.fields.new_member_past_month}
          </div>

          <div>
            <b>Monthly dues status:</b> {member.fields.monthly_dues_status}
          </div>
          <div>
            <b>Yearly dues status:</b> {member.fields.yearly_dues_status}
          </div>

          <div>
            <b>Join Date:</b> {member.fields.join_date}
          </div>
          <div>
            <b>Expiry Date:</b> {member.fields.xdate}
          </div>
        </section>
      </div>
    </div>
  );
}
