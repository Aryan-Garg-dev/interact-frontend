import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type LinkDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setURL: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: ()=>void;
};

const LinkDialog = ({
  open, 
  setOpen,
  setURL,
  onSubmit
}: LinkDialogProps)=>{

  const onConfirm = ()=>{
    onSubmit();
    setOpen(!open); 
  }

  return (
    <Dialog open={open} onOpenChange={()=>setOpen(!open)} defaultOpen={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
          <DialogDescription>Enter the link you want to embed.</DialogDescription>
        </DialogHeader>
        <input 
          type="text" 
          placeholder="Enter URL" 
          className="w-full p-2 border border-gray-300 rounded-md" 
          onChange={(e)=>setURL(e.target.value)}
        />
        <DialogFooter>
          <Button type="submit" onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LinkDialog;