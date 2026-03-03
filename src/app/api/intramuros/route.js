import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzScAQrSKXiU5dxEkBAMW5r7SKwBQRsP7VyzahxnrAOtLEC-DC4scn4tkzwf_Tm7nOC/exec";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  //  Reenviar TODOS los params a Google, no solo "hoja"
  const googleUrl = `${GOOGLE_SCRIPT_URL}?${searchParams.toString()}`;

  try {
    const response = await fetch(googleUrl, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { status: "error", data: [], message: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const result = await response.json();
      return NextResponse.json(result);
    } else {
      const errorText = await response.text();
      console.error("Google devolvió HTML en lugar de JSON:", errorText);
      return NextResponse.json(
        {
          status: "error",
          message:
            "Google Script no está configurado como JSON o la URL es vieja.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
}
