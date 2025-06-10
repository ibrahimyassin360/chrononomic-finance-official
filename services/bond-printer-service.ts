import { ethers } from "ethers"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import ChrononBondABI from "@/contracts/ChrononBond.json"
import { CONTRACT_ADDRESSES } from "@/config/contracts"

export interface MintBondParams {
  to: string
  faceValue: string
  couponRate: string
  maturityChronon: number
  metadataURI: string
}

export async function mintBond(
  params: MintBondParams,
  signer: ethers.Signer,
  chainId: number,
): Promise<number> {
  const addresses = CONTRACT_ADDRESSES[chainId] || {}
  if (!addresses.ChrononBond) {
    throw new Error("Bond contract address not found for this network")
  }

  const bondContract = new ethers.Contract(addresses.ChrononBond, ChrononBondABI.abi, signer)

  const tx = await bondContract.mintBond(
    params.to,
    ethers.utils.parseUnits(params.faceValue, 18),
    params.couponRate,
    params.maturityChronon,
    params.metadataURI,
  )

  const receipt = await tx.wait()
  const event = receipt.events?.find((e: any) => e.event === "BondMinted")
  return event ? event.args.bondId.toNumber() : 0
}

export interface CertificateMetadata {
  bondId: number
  faceValue: string
  couponRate: string
  maturityChronon: number
  series: string
  issueDate: string
  holderName?: string
}

export function generateBondCertificate(meta: CertificateMetadata): Uint8Array {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text("Chrononomic Bond Certificate", 20, 20)
  doc.setFontSize(12)
  doc.text(`Bond ID: ${meta.bondId}`, 20, 30)
  doc.text(`Series: ${meta.series}`, 20, 40)
  doc.text(`Face Value: ${meta.faceValue} χ`, 20, 50)
  doc.text(`Coupon Rate: ${meta.couponRate}%`, 20, 60)
  doc.text(`Maturity (Chronon): ${meta.maturityChronon}`, 20, 70)
  doc.text(`Issue Date: ${meta.issueDate}`, 20, 80)
  if (meta.holderName) {
    doc.text(`Holder: ${meta.holderName}`, 20, 90)
  }

  autoTable(doc, {
    startY: 100,
    head: [["Field", "Value"]],
    body: [
      ["Bond ID", meta.bondId.toString()],
      ["Series", meta.series],
      ["Face Value", `${meta.faceValue} χ`],
      ["Coupon Rate", `${meta.couponRate}%`],
      ["Maturity", meta.maturityChronon.toString()],
      ["Issue Date", meta.issueDate],
    ],
  })

  return doc.output("arraybuffer") as Uint8Array
}
