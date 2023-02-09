import { useToImage } from "@hcorta/react-to-image";
import { Button, Divider, TextField } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { PRIMARY_COLOR } from "../../config/colors";
import CookieService from "../../data/services/cookie_service";
import usePrescriptionPageStore from "../../data/stores/prescription_page_store";

function PrescriptionPage() {
  const location = useLocation();

  const currentUser = CookieService.getCookie("user");

  const { updateState, isLoading, convertPrescriptionToPng, convertToPdf } =
    usePrescriptionPageStore();

  const appointmentDate = dayjs(
    new Date(location.state?.appointment[0].appointmentDate.seconds * 1000)
  ).format("DD-MMM-YYYY");

  const {
    ref,
    getPng,
    dataURL,
    isLoading: isImageConversionLoading,
  } = useToImage({}, () => {});

  useEffect(() => {
    convertToPdf({ dataURL });
  }, [convertToPdf, dataURL]);

  useEffect(() => {
    usePrescriptionPageStore.setState({
      appointment: { ...location.state?.appointment[0], appointmentDate } ?? {},
    });
  }, [appointmentDate, location.state?.appointment]);

  return (
    <main className="bg-disabled min-h-screen flex justify-center items-center">
      <div className="rounded-xl bg-white w-[65%] flex justify-center items-center flex-col space-y-4 p-10">
        <div className="w-[100%] space-y-4" ref={ref}>
          <div className="flex justify-between">
            <img src={logo} alt="logo" className="w-[80px] h-[80px]" />
            <div>
              <h4 className="font-semibold">Dr. {currentUser?.displayName}</h4>
            </div>
          </div>
          <Divider color={PRIMARY_COLOR} />
          <p className="text-sm text-primary">
            Token No.{" "}
            <span className="font-semibold">
              {location.state?.appointment[0].tokenNumber ?? ""}
            </span>
          </p>
          <div>
            <div className="flex items-end space-x-2">
              <p className="text-sm text-primary">Name: </p>
              <div className="w-[55%] text-center">
                <p className="text-sm font-semibold">
                  {location.state?.appointment[0].fullName ?? ""}
                </p>
                <Divider color="black" />
              </div>
              <p className="text-sm text-primary">Age: </p>
              <div className="w-[15%] text-center">
                <p className="text-sm font-semibold">
                  {location.state?.appointment[0].age ?? ""}
                </p>
                <Divider color="black" />
              </div>
              <p className="text-sm text-primary">Date: </p>
              <div className="w-[15%] text-center">
                <p className="text-sm font-semibold">{appointmentDate}</p>
                <Divider color="black" />
              </div>
            </div>

            <div className="mt-3 min-h-[50vh]">
              <TextField
                required
                variant="outlined"
                multiline
                fullWidth
                minRows={15}
                onChange={(e) => {
                  updateState({
                    state: "prescription",
                    value: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-2 text-right w-full">
          <Button
            variant="contained"
            size="small"
            disabled={isLoading || isImageConversionLoading}
            onClick={() => convertPrescriptionToPng({ getPng })}
          >
            {isLoading || isImageConversionLoading ? "Uploading.." : "Upload"}
          </Button>
        </div>
      </div>
    </main>
  );
}

export default PrescriptionPage;
