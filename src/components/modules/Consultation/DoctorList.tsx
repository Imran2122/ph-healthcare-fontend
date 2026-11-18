"use client";
import { getDoctors } from "@/app/(commonLayout)/consultation/_action";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const DoctorList = () => {
  const { data } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  return (
    <div>
      {data.data.map((doctor: any) => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
};

export default DoctorList;
